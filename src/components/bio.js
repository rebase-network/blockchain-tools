/**
 * Bio component that queries for data
 * with Gatsby's StaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/static-query/
 */

import React from "react"
import { StaticQuery, graphql } from "gatsby"
import Image from "gatsby-image"

import { rhythm } from "../utils/typography"

function Bio() {
  return (
    <StaticQuery
      query={bioQuery}
      render={data => {
        const { author } = data.site.siteMetadata
        return (
          <div>
            {/* <div
              style={{
                display: `flex`,
                marginBottom: rhythm(2.5),
              }}
            >
              <Image
                fixed={data.avatar.childImageSharp.fixed}
                alt={author}
                style={{
                  marginRight: rhythm(1 / 2),
                  marginBottom: 0,
                  minWidth: 50,
                }}
              />
              <p>
                Hosted by <strong>{author}</strong> which are a decentralized organization.
              </p>
            </div> */}
            <div
              style={{
                marginBottom: rhythm(2.5),
              }}
            >
            <Image
                fixed={data.qr.childImageSharp.fixed}
                alt={author}
                style={{
                  marginTop: rhythm(1 / 2),
                  marginBottom: 0,
                  minWidth: 50,
                }}
              />
            </div>
          </div>
        )
      }}
    />
  )
}

const bioQuery = graphql`
  query BioQuery {
    avatar: file(absolutePath: { regex: "/rebase.jpg/" }) {
      childImageSharp {
        fixed(width: 50, height: 50) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    qr: file(absolutePath: { regex: "/rebase-qr.jpg/" }) {
      childImageSharp {
        fixed(width: 150, height: 150) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    site {
      siteMetadata {
        author
        social {
          twitter
        }
      }
    }
  }
`

export default Bio
