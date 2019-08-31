'use strict';

var _ = require('lodash');

module.exports = function(Blogs) {
    Blogs.common = (blogId, cb) => {
        Blogs.findOne({where: {blogId: blogId}, fields: {users: true}}, (err, record) => {
            if(err)
                cb(err);
            else {
                var users = record.users;
                var query = {"where": {"users": {inq: users}}, fields: {"title": true, "text": true}};
                Blogs.find(query, (err, result) => {
                    if(err)
                        cb(err);
                    else {
                        cb(null, result);
                    }
                });
            }
        });
    };
    Blogs.remoteMethod(
        'common', {
            http: {
                path: '/common',
                verb: 'get'
            },
            accepts: {
                arg: 'blogId', type: 'number', required: true
            },
            returns: [
                {arg: "title", type: "string"},
                {arg: "text", type: "string"}
            ]
                
        }
    )
};