import * as ckbUtils from '@nervosnetwork/ckb-sdk-utils'

import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "../utils/typography"

const MainNetCodeHash = '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8'

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
    const parsedHex = ckbUtils.bytesToHex(ckbUtils.parseAddress(addr))
    const blake160 = "0x" + parsedHex.toString().slice(6)
 
    const lockHash = ckbUtils.scriptToHash({
      hashType: "type",
      codeHash: MainNetCodeHash,
      args: blake160,
    })
    
    this.setState({
      addr,
      blake160,
      lockHash,
    })

  }

  render() {
    if (!this.state) return null
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const {addr, blake160, lockHash } = this.state

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="Decode" />
        <h3
          style={{
            marginBottom: rhythm(1),
          }}
        >
          Decode Address to Blake160 and LockHash
        </h3>
 
        <input style={{width: '30rem'}} type="text" name="addr" value={this.state.decodeAddr} onChange={this.upDecodeAddr}/>
        <br/>
        <br/>

        <button onClick={this.onEncodeAddress}>Encode</button>
        <br/>
        <br/>

        <div><strong>address</strong>: {addr}</div>
        <br/>

        <div><strong>blake160</strong>: {blake160}</div>
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
