import { curry } from 'ramda'
import React from 'react'
import { Platform, ScrollView, Text } from 'react-native'
import Permissions from 'react-native-permissions'
import RNStoryShare from 'react-native-story-share'
import ViewShot, { captureRef } from 'react-native-view-shot'
import { Button } from './Button'
import { ShareSection } from './ShareSection'

const base64Background =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAQAAAAHUWYVAAABKUlEQVR42u3RMQEAAAjDMOZf9DDBwZFKaNKOHhUgQAQEiIAAERAgAgJEQAQEiIAAERAgAgJEQAQEiIAAERAgAgJEQAQEiIAAERAgAgJEQAQEiIAAERAgAgJEQAQEiIAAERAgAgJEQAQEiIAAERAgAgJEQAQEiIAAERAgAgJEQAQEiIAAERAgAgJEQAQEiIAAERAgAgJEQICYAERAgAgIEAEBIiBABERAgAgIEAEBIiBABERAgAgIEAEBIiBABERAgAgIEAEBIiBABERAgAgIEAEBIiBABERAgAgIEAEBIiBABERAgAgIEAEBIiBABERAgAgIEAEBIiBABERAgAgIEAEBIiBABAQIECACAkRAgAgIEAEBIiACAkRAgAgIEAEBIiACAkRAgOiyBdIBj0hI3a/GAAAAAElFTkSuQmCC'
const base64Sticker =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAABn0lEQVR42u3TAQ0AAAjDMO5fNCAABaTNLCxdtQGXGAQMAgYBg4BBwCBgEDAIGAQMAhgEDAIGAYOAQcAgYBAwCBgEDGIQMAgYBAwCBgGDgEHAIGAQMAhgEDAIGAQMAgYBg4BBwCBgEDAIYBAwCBgEDAIGAYOAQcAgYBDAIGAQMAgYBAwCBgGDgEHAIGAQwCBgEDAIGAQMAgYBg4BBwCCAQcAgYBAwCBgEDAIGAYOAQcAggEHAIGAQMAgYBAwCBgGDgEHAIAYBg4BBwCBgEDAIGAQMAgYBgwAGAYOAQcAgYBAwCBgEDAIGAYMYBAwCBgGDgEHAIGAQMAgYBAwCGAQMAgYBg4BBwCBgEDAIGAQMAhgEDAIGAYOAQcAgYBAwCBgEMAgYBAwCBgGDgEHAIGAQMAgYBDAIGAQMAgYBg4BBwCBgEDAIYBAwCBgEDAIGAYOAQcAgYBAwCGAQMAgYBAwCBgGDgEHAIGAQMIhBwCBgEDAIGAQMAgYBg4BBwCCAQcAgYBAwCBgEDAIGAYOAQcAgBgGDgEHAIGAQMAgYBAwCHw2n4Y9IKdr/IQAAAABJRU5ErkJggg=='

// curry is not necessary RNStoryShares functions
// it returns a new function when only part of the arguments are provided
// see https://ramdajs.com/docs/#curry
const shareInstagram = curry((onError, type, backgroundAsset, stickerAsset) => {
  RNStoryShare.shareToInstagram({
    backgroundAsset,
    stickerAsset,
    backgroundBottomColor: '#f44162',
    backgroundTopColor: '#f4a142',
    attributionLink: '',
    type,
  }).catch(onError)
})

class Root extends React.PureComponent {
  state = {
    error: undefined,
    isInstagramAvailable: false,
  }

  async componentDidMount() {
    if (Platform.OS === 'android') {
      Permissions.request('storage').then(response => {
        if (response === 'denied') {
          this.setState({ error: 'No permissions' })
        }
      })
    }

    try {
      const isInstagramAvailable = await RNStoryShare.isInstagramAvailable()

      this.setState({ isInstagramAvailable })
    } catch (error) {
      this.setState({ error })
    }
  }

  _ref = undefined

  _setError = e => {
    this.setState({ error: e })
  }

  _captureScreen = () =>
    new Promise(resolve => {
      captureRef(this._ref, {
        format: 'png',
        quality: 0.8,
      })
        .then(uri => {
          resolve(uri)
        })
        .catch(this._setError)
    })

  _shareInstaBase64 = shareInstagram(this._setError, RNStoryShare.BASE64)
  _shareInstaBackground = () => {
    this._shareInstaBase64(base64Background, undefined)
  }
  _shareInstaSticker = () => {
    this._shareInstaBase64(undefined, base64Sticker)
  }
  _shareInstaBoth = () => {
    this._shareInstaBase64(base64Background, base64Sticker)
  }

  _shareInstaFile = shareInstagram(this._setError, RNStoryShare.FILE)
  _shareInstaFileBackground = async () => {
    const uri = await this._captureScreen()

    this._shareInstaFile(uri, undefined)
  }
  _shareInstaFileSticker = async () => {
    const uri = await this._captureScreen()

    this._shareInstaFile(undefined, uri)
  }
  _shareInstaFileBoth = async () => {
    const uri = await this._captureScreen()

    this._shareInstaFile(uri, uri)
  }

  _setRef = ref => {
    this._ref = ref
  }

  render() {
    const { error, isInstagramAvailable } = this.state

    return (
      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
          paddingVertical: 64,
          paddingHorizontal: 16,
        }}
        style={{ flex: 1 }}
      >
        <ViewShot ref={this._setRef}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 24,
              marginVertical: 64,
            }}
          >
            RNStoryShare Example
          </Text>

          <ShareSection
            title="Instagram Base64"
            isAvailable={isInstagramAvailable}
          >
            <Button onPress={this._shareInstaBackground}>Background</Button>
            <Button onPress={this._shareInstaSticker}>Sticker</Button>
            <Button onPress={this._shareInstaBoth}>Both</Button>
          </ShareSection>

          <ShareSection
            title="Instagram File"
            isAvailable={isInstagramAvailable}
          >
            <Button onPress={this._shareInstaFileBackground}>Background</Button>
            <Button onPress={this._shareInstaFileSticker}>Sticker</Button>
            <Button onPress={this._shareInstaFileBoth}>Both</Button>
          </ShareSection>
        </ViewShot>

        <Text style={{ marginTop: 48, minHeight: 80 }}>
          {error ? `error: ${error.message}` : null}
        </Text>
      </ScrollView>
    )
  }
}

export { Root }
