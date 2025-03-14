// app.get('/notes',verifyToken ,async(req,res)=>{
//     const uname=req.username;
//     console.log(req.username)
//     // if (!req.session.username) {
//     //     // If session has expired, redirect to login page
//     //     return res.redirect('/');
//     // }
//     // let allNotes=await notesModel.find({name: req.session.username})
//     let allNotes=await notesModel.find({name: uname}).sort({ updatedAt: -1 })
//     // const user=req.flash("user")
//     // req.session.username=user
//     res.render('notes', {user: uname, allnotes: allNotes})
// })

export async function GET(request: NextRequest) {
    try{
        const reqbody=await request.json()
    }
}