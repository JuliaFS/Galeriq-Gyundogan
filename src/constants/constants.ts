const Path = {
    Home: "/",
    Register: "/register",
    Login: "/login",
    Logout: "/logout",
    Gallery: "/gallery",
    CreatePicture: "/create-picture",
    Details: "/gallery/:pictureId",
    PictureEdit: "/gallery/:pictureId/edit",
    PictureDelete: "/gallery/:pictureId/delete",
    Error404Path: "*",
}

// const Notifications ={
//         CreateError: "You have to fill correctly all fields!",
//         Create: "Something wrong, you can not create picture. Pls try again later....",
//         Voted: "Sorry, you already voted for this picture...",
//         EmptyComment: "You can not published empty comment.",
//         CommentNotPublished: "Error during publish comment...",
//         EditError: "Pls, fill all the fields correctly!",
//         OnEditError: "Unsuccesfull edited!",
//         CanNotGetImage: "Unsuccesfull loading the images...",
//         ConfirmDelete: "Are you sure you want to delete this picture?",
// }

export {
    Path,
    //Notifications
}