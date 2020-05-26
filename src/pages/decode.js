import * as ckbUtils from '@nervosnetwork/ckb-sdk-utils'
import * as bech32 from "bech32";

import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "../utils/typography"

const SECP256K1_BLAKE160_SIGHASH_ALL_TYPE_HASH = '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8'
const SECP256K1_BLAKE160_MULTISIG_ALL_TYPE_HASH = "0x5c5069eb0857efc65e1bca0c07df34c31663b3622fd3876c876320fc9634e2a8"

class BlogIndex extends React.Component {
  state = {
    decodeAddr: '',
  }

  upDecodeAddr= (evt) =>{
    this.setState({
      decodeAddr: evt.target.value
    });
  }

  onEncodeAddress = () => {
    const addr = this.state.decodeAddr
    const payload = bech32.decode(addr, 95)
    const data = bech32.fromWords(payload.words)
    let hashType = ''
    let codeHash = ''
    let args = ''

    // https://github.com/ququzone/keyper/blob/master/packages/specs/src/address.ts#L16-L51

    if (data[0] === 1) {
      // short address
      if (data[1] === 0) {
        // SECP256K1 + blake160
        hashType = "type"
        codeHash = SECP256K1_BLAKE160_SIGHASH_ALL_TYPE_HASH
        args = `0x${Buffer.from(data.slice(2)).toString("hex")}`
      } else if (data[1] === 1) {
        // SECP256K1 + multisig
        hashType = "type"
        codeHash = SECP256K1_BLAKE160_MULTISIG_ALL_TYPE_HASH
        args = `0x${Buffer.from(data.slice(2)).toString("hex")}`
      } else {
        alert(`Invalid address: ${addr}`)
        throw new Error(`Invalid address: ${addr}`)
      }

    } else if (data[0] === 2) {
      // long hash_type: data
      hashType = "data"
      codeHash = `0x${Buffer.from(data.slice(1, 33)).toString("hex")}`
      args = `0x${Buffer.from(data.slice(33)).toString("hex")}`
    } else if (data[0] === 4) {
      // long hash_type: type
      hashType = "type"
      codeHash = `0x${Buffer.from(data.slice(1, 33)).toString("hex")}`
      args = `0x${Buffer.from(data.slice(33)).toString("hex")}`
    } else {
      alert(`Invalid address: ${addr}`)
      throw new Error(`Invalid address: ${addr}`);
    }

    const lockHash = ckbUtils.scriptToHash({
      hashType: hashType,
      codeHash: codeHash,
      args: args,
    })

    this.setState({
      addr,
      hashType,
      args,
      codeHash,
      lockHash,
    })
  }

  render() {
    if (!this.state) return null
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const {addr, hashType, args, codeHash, lockHash } = this.state

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="Decode" />
        <h3
          style={{
            marginBottom: rhythm(1),
          }}
        >
          Decode Address to Args and LockHash
        </h3>

        <input style={{width: '30rem'}} type="text" name="addr" value={this.state.decodeAddr} onChange={this.upDecodeAddr}/>
        <br/>
        <br/>

        <button onClick={this.onEncodeAddress}>Encode</button>
        <br/>
        <br/>

        <div><strong>address</strong>: {addr}</div>
        <br/>

        <div><strong>hashType</strong>: {hashType}</div>
        <br/>

        <div><strong>codeHash</strong>: {codeHash}</div>
        <br/>

        <div><strong>args</strong>: {args}</div>
        <br/>

        <div><strong>lockHash</strong>: {lockHash}</div>
        <br/>
        <br/>
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
  }
`
