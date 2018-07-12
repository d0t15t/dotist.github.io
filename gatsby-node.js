const path = require("path");
const { createFilePath } = require('gatsby-source-filesystem')

 exports.onCreateNode = ({ node, getNode, boundActionCreators}) => {
  if(node.internal.type == 'MarkdownRemark') {
    const { createNodeField } = boundActionCreators;
    const slug = createFilePath({
      node,
      getNode,
      basePath: 'posts'
    });
    createNodeField({
      node,
      name: 'slug',
      value: `/posts${slug}`
    })
  }
}

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage} = boundActionCreators;
  return new Promise((resolve, reject) => {
    graphql(`
      {
        allMarkdownRemark {
          edges {
            node {
              id
              fields {
                slug
              }
            }
          }
        }
      }
    `).then(result => {
      result.data.allMarkdownRemark.edges.forEach(({ node }) => {
        createPage({
          path: node.fields.slug,
          component: path.resolve('./src/components/PostPage.js'),
          context: {
            slug: node.fields.slug,
          }
        });
      });
      resolve();
    });
  });
}