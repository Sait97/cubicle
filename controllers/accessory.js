module.exports = {
    createAccessory(req, res){
        res.render('createAccessory', {title: 'Create new Accesssory'})
    },
    async accssesoaryPost(req,res){
        const accessory = {
            name: req.body.name,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
        };
        await req.storage.createAccessory(accessory);
        res.redirect('/')
    }

}