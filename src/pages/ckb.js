import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "../utils/typography"

import Core from '@nervosnetwork/ckb-sdk-core'
import Address from '@nervosnetwork/ckb-sdk-address'
import { ec as EC } from 'elliptic'
import { nodejs, browser } from '../utils/node-or-browser'
console.log(Core, '\n=======core')
console.log('\n=======000000')
console.log(Address, '\n=======address')
console.log(EC, '\n=======ec')

// const EC = require('elliptic').ec
// const Core = require('@nervosnetwork/ckb-sdk-core').default
// const Address = require('@nervosnetwork/ckb-sdk-address').default


console.log('nodejs, browser: ', nodejs, browser)

class BlogIndex extends React.Component {
  // state = {
  //   privateKey: undefined,
  //   address: undefined,
  //   script: undefined,
  // }
  componentDidMount() {
    this.bootstrap()
  }

  bootstrap = () => {
    const ec = new EC('secp256k1')

    const privateKey = ec.genKeyPair()

    const address = new Address(privateKey, { prefix: 'ckt' }) // the ckt is the signal for testnet

    console.log('privateKey: ', '0x'+address.getPrivateKey());
    console.log('address: ', address.value);
    this.setState({ privateKey: '0x'+address.getPrivateKey(), address: address.value })
      /**
       * Generate script code for mining
       * block_assembler needs `code_hash` and `args` field
       */

    // https://github.com/nervosnetwork/ckb-sdk-js/blob/develop/packages/ckb-sdk-core/examples/sendTransaction.js#L10-L16

    const nodeUrl = process.env.NODE_URL || 'http://localhost:8114' // example node url

    const core = new Core(nodeUrl) // instantiate the JS SDK with provided node url
    return async () => {
      const systemCellInfo = await core.loadSystemCell() // load system cell, which contains the secp256k1 algorithm used to verify the signature in transaction's witnesses.

      /**
       * The system encryption code hash is the hash of system cell's data by blake2b algorithm
       */
      const SYSTEM_ENCRYPTION_CODE_HASH = core.rpc.paramsFormatter.toHash(systemCellInfo.codeHash)

      /**
       * genereat address object, who has peroperties like private key, public key, sign method and verify mehtod
       * - value, the address string
       * - privateKey, the private key in hex string format
       * - publicKey, the public key in hex string format
       * - sign(msg): signature string
       * - verify(msg, signature): boolean
       */
      const myAddressObj = core.generateAddress(privateKey)
      /**
       * to see the address
       */
      // console.log(myAddressObj.value)

      /**
       * calculate the lockhash by the address
       * 1. a blake160-ed public key is required in the args field of lock script
       * 2. compose the lock script with SYSTEM_ENCRYPTION_CODE_HASH, and args
       * 3. calculate the hash of lock script
       */
      const blake160edPublicKey = core.utils.blake160(myAddressObj.publicKey, 'hex')
      /**
       * to see the blake160-ed public key
       */
      // console.log(blake160edPublicKey)

      const script = {
        codeHash: SYSTEM_ENCRYPTION_CODE_HASH,
        args: ["0x" + blake160edPublicKey],
      }

      console.log('\nscript: ', script)
      await this.setState({ script })
    }
  }

  render() {
    if (!this.state) return null
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    // const posts = data.allMarkdownRemark.edges
    const { privateKey, address, script } = this.state
    console.log('======\n this.state: ', this.state)

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="CKB" />
        <h3
          style={{
            marginBottom: rhythm(1 / 4),
          }}
        >
          CKB private key and address generator
        </h3>
        <div>privateKey: {privateKey}</div>
        <div>address: {address}</div>
        <div>codeHash: {script && script.codeHash}</div>
        <div>args: {script && script.args}</div>
        <div></div>
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
          }
        }
      }
    }
  }
`
