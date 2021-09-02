const Cube = require('../models/Cube')
const Comment = require('../models/Comment');
const Accessory = require('../models/Accessory');
 /*
     {
        "name": "str",
        "description": "str",
        "image URL": "str",
        "difficulty": "number"
    }
*/
async function init(){
  return (req, res, next) => {
        req.storage = {
            getAll,
            getById,
            create,
            edit,
            createComment,
            createAccessory,
            getAllAccessories,
            attachSticker
        };
        next();
    };
}

async function getAll(query){
    const options = {}
    
    if(query.search){
        options.name = {$regex: query.search, $options: 'i'};
    }
    if(query.from){
        options.difficulty = {$gte: Number(query.from) };
    }
    if(query.to){
        options.difficulty = options.difficulty || {}
        options.difficulty.$lte = Number(query.to)
     };
        
        const cubes = Cube.find(options).lean();
        return cubes
    }



async function getById(id){
    const cube = await Cube.findById(id).populate('comments').populate('accessories').lean();
    if(cube){
        return  cube;
    }else {
        return undefined;
    }
}

async function create(cube){
    const record = new Cube(cube);
    return record.save();
   
}

async function edit(id, cube){
    const existing = await Cube.findById(id)

    if(!existing){
        throw new ReferenceError('NO such ID in database')
    }

    Object.assign(existing, cube);
    return existing.save()
}
async function createComment(cubeId, comment){
    const cube = await Cube.findById(cubeId)

    if(!existing){
        throw new ReferenceError('NO such ID in database')
    }
    const newComment = new Comment(comment);
    await newComment.save();
    cube.comments.push(newComment);
    await cube.save();
}
async function getAllAccessories(existing){
    return Accessory.find({_id: { $nin: existing}}).lean();
}
async function createAccessory(accessory){
    const record = new Accessory(accessory)
    return record.save();
}

async function attachSticker(cubeId, stikerId){
    const cube = await Cube.findById(cubeId)
    const sticker = await Accessory.findById(stikerId);

    if(!cube || !sticker){
        throw new ReferenceError('NO such ID in database')
    }
    cube.accessories.push(sticker);
    return cube.save()
}

module.exports = {
    init,
    getAll,
    getById,
    create,
    edit,
    createComment,
    createAccessory,
    getAllAccessories,
    attachSticker
}