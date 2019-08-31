'use strict';

module.exports = function(Comment) {
Comment.disableRemoteMethodByName('create', true);
Comment.addUserToBlog = (userId, blogId, cb) =>{
    Comment.create({userId: userId, blogId: blogId}, (err, res) => {
        if(err)
            cb(err);
        else {
            cb(null, res);
        }
    });  
};
  Comment.afterRemote('addUserToBlog', (ctx, result, next) => {
    Comment.app.models.Blogs.findOne({"where": {"blogId":result.blogId}}, (err, res) => {
        if(err)
            next(err);
        else {
            if(res.users == null)
                res.users = [result.userId];
            else
                res.users.push(result.userId);
            Comment.app.models.Blogs.replaceById(res.id, res, (err, r) =>{
            next();
            });
        }
    });
  });  
Comment.remoteMethod(
    'addUserToBlog', {
        http: {
            path: '/',
            verb: 'post'
        },
        accepts: [
            {arg: 'userId', type: 'number',http: {source: "query"}, required: true},
            {arg: 'blogId', type: 'number',http: {source: "query"}, required: true},
        ],
        returns: {
            type: 'string',
            root: true
        }   
    }
)
};
// If we don't want to add a hook, put it in the else loop of remote method
// Comment.app.models.Blogs.findOne({"where": {"blogId": blogId}}, (err, result) => {
            //     if(err)
            //         cb(err);
            //     else {   
            //         if(result.users == null)
            //             result.users = [userId];
            //         else
            //             result.users.push(userId);
            //         Comment.app.models.Blogs.replaceById(result.id, result, (err, result) =>{
            //             cb(err, result);
            //         });
            //     }
// });