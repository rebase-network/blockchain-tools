import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm } from "../utils/typography"

import Address from '@nervosnetwork/ckb-sdk-address'
import { ec as EC } from 'elliptic'

const ec = new EC('secp256k1')

class BlogIndex extends React.Component {
  state = {
    privateKey: null,
    mainnetaddress: null,
    testnetaddress: null,
  }
  componentDidMount() {
    // this.bootstrap()
  }

  genAddress() {
    const privateKey = ec.genKeyPair()
    const mainaddr = new Address(privateKey, { prefix: 'ckb' })
    const testaddr = new Address(privateKey, { prefix: 'ckt' }) // the ckt is the signal for testnet

    this.setState({ privateKey: '0x'+testaddr.getPrivateKey(), mainnetaddress: mainaddr.value, testnetaddress: testaddr.value })
  }

  onGenAddress = () => {
    this.genAddress()
  }

  render() {
    if (!this.state) return null
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const { privateKey, mainnetaddress, testnetaddress } = this.state

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

        <div><strong>主网地址(mainnetAddress)</strong>: {mainnetaddress}</div>
        <br/>

        <div><strong>测试网地址(testnetAddress)</strong>: {testnetaddress}</div>
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
