module.exports = function(d){
    var date = new Date(d);
    return date.getFullYear()+'-'+(date.getMonth()-0+1)+'-'+(date.getDate());
}