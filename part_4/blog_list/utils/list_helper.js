const _ = require('lodash');
const dummy = ( blogs ) => {

    return 1;
}


const totalLikes = ( blogs ) => {

    let totalLikes = 0;
    blogs.forEach(blog => totalLikes = totalLikes + blog.likes)
    return totalLikes;
}


const favoriteBlog = ( blogs ) => {
    let fav = blogs[0]
    blogs.forEach(blog => {
        if (blog.likes > fav.likes) {
            fav = {
                title: blog.title,
                author: blog.author,
                likes: blog.likes
            }
        }
    })
    return fav;

}


const mockedBlogs = [
    {
        title: "Canonical string reduction",
        author: "Pedro",
        likes: 20,
      },
      {
        title: "First class tests",
        author: "Sandra",
        likes: 10,
      },
      {
        title: "TDD harms architecture",
        author: "Sandra",
        likes: 3,
      }
]


const mostBlogs = ( blogs ) => {

    let maximumBlogs = {author: '', blogs: 0}
    _.mapKeys(_.groupBy( blogs, 'author'), (v, k) => {
        let result = {
            author: k,
            blogs: v.length
        }
        maximumBlogs = (result.blogs > maximumBlogs.blogs) ? result : maximumBlogs;

    })
}

mostBlogs(mockedBlogs)


const mostLikes = ( blogs ) => {
    let maximumLikes = {author: '', likes: 0}
    _.mapKeys(_.groupBy( blogs, 'author'), (v, k) => {
        let result = {
            author: k,
            likes: _.sumBy(v, 'likes')
        }
        maximumLikes = (result.likes > maximumLikes.likes) ? result : maximumLikes;

    })
}
mostLikes(mockedBlogs)

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs }