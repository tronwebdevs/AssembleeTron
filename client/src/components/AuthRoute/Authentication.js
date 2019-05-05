
const Authentication = {
    isAuthed: false,
    signin(cb) {
        this.isAuthenticated = true;
        setTimeout(cb, 50);
    },
    signout(cb) {
        this.isAuthenticated = false;
        setTimeout(cb, 50);
    }
};

export default Authentication;