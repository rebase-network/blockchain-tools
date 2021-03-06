import { ec as EC } from 'elliptic'
import * as ckbUtils from '@nervosnetwork/ckb-sdk-utils'

import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "../utils/typography"

const MainNetCodeHash = '0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8'

const ec = new EC('secp256k1')

class BlogIndex extends React.Component {
  state = {
    privateKey: null,
    mainnetaddress: null,
    testnetaddress: null,
  }

  onGenAddress = () => {

    const mainnetOpts = {
      prefix: 'ckb',
      type: '0x01',
      codeHashOrCodeHashIndex: '0x00',
    }
    
    const testnetOpts = {
      prefix: 'ckt',
      type: '0x01',
      codeHashOrCodeHashIndex: '0x00',
    }

    const privateKey = "0x" + ec.genKeyPair().priv.toString('hex')
    // privateKey need to be BN
    const pubKey = ckbUtils.privateKeyToPublicKey(privateKey)
    const blake160 = "0x" + ckbUtils.blake160(pubKey, "hex")
    const lockHash = ckbUtils.scriptToHash({
      hashType: "type",
      codeHash: MainNetCodeHash,
      args: blake160,
    })
    
    const mainAddr = ckbUtils.privateKeyToAddress(privateKey, mainnetOpts)
    const testAddr = ckbUtils.privateKeyToAddress(privateKey, testnetOpts)
    
    this.setState({
      privateKey,
      pubKey,
      blake160,
      lockHash,
      mainnetaddress: mainAddr,
      testnetaddress: testAddr,
    })

  }

  render() {
    if (!this.state) return null
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const { privateKey, pubKey, blake160, lockHash, mainnetaddress, testnetaddress } = this.state

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="CKB" />
        <h3
          style={{
            marginBottom: rhythm(1),
          }}
        >
          CKB 在线钱包工具
          <br/>
          Your CKB private key and address
        </h3>
        <p
          style={{
            padding: 10,
            borderRadius: 3,
            border: '2px solid #ff5d5d'
          }}
        >
          此工具仅用于生成CKB地址，仅做测试用途。在线生成地址有风险，请咨询有经验的人帮你生成。本工具支持离线生成，你可以先断网再点击Generate按钮。
          (This ONLY uses for CKB Address, and is NOT a recommended way of creating a wallet. Please ask experienced crypto users to help you generate them. This tool support offline generating and you can turn off your internet connection before click Generate button.)
        </p>
        <button onClick={this.onGenAddress}>生成地址(Generate)</button>
        <div><strong>私钥(privateKey)</strong>: {privateKey}</div>
        <br/>

        <div><strong>公钥(publicKey)</strong>: {pubKey}</div>
        <br/>

        <div><strong>blake160</strong>: {blake160}</div>
        <br/>

        <div><strong>lockHash</strong>: {lockHash}</div>
        <br/>
        
        <div><strong>测试网地址(testnetAddress)</strong>: {testnetaddress}</div>
        <br/>

        <div><strong>主网地址(mainnetAddress)</strong>: {mainnetaddress}</div>
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
