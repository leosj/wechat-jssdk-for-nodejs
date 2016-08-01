module.exports = function ( app ) {
    require('./jssdk')(app);
    require('./getuserinfo')(app);
};