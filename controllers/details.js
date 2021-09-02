
module.exports = {
    details: async(req, res) => {
        const cube = await req.storage.getById(req.params.id);
      
        if(cube == undefined){
            res.redirect('/404');
        }else {
            const ctx = {
                title: 'Cubicle',
                cube,
            
            }
            res.render('details', ctx);

        }

    },
    async attach(req, res){
        const cube = await req.storage.getById(req.params.id);
        const accessories = await req.storage.getAllAccessories((cube.accessories || []).map(a => a._id));

        res.render('attach', {
            title: 'Attach Stickers',
            cube,
            accessories
        })
    },
    async attachPost(req, res){
        const cubeId = req.params.cubeId;
        const stikerId = req.body.accessory

        await req.storage.attachSticker(cubeId, stikerId);

        res.redirect(`/details/${req.params.cubeId}`);
    }
}