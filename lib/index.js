/// <reference types="remark-parse" />
/// <reference types="remark-stringify" />
/// <reference types="mdast-util-lemmy-spoiler" />

/**
 * @typedef {import('mdast').Root} Root
 * @typedef {import('unified').Processor<Root>} Processor
 */

import {spoilerFromMarkdown} from 'mdast-util-lemmy-spoiler'
import {spoiler} from 'micromark-extension-lemmy-spoiler'

/**
 * Add support for lemmy spoilers.
 *
 * @returns {undefined}
 *   Nothing.
 */
export default function remarkDirective() {
  // @ts-expect-error: TS is wrong about `this`.
  // eslint-disable-next-line unicorn/no-this-assignment
  const self = /** @type {Processor} */ (this)
  const data = self.data()

  const micromarkExtensions =
    data.micromarkExtensions || (data.micromarkExtensions = [])
  const fromMarkdownExtensions =
    data.fromMarkdownExtensions || (data.fromMarkdownExtensions = [])

  micromarkExtensions.push(spoiler())
  fromMarkdownExtensions.push(spoilerFromMarkdown())
}
