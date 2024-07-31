/**
 * @typedef {import('mdast').Root} Root
 */

import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import process from 'node:process'
import test from 'node:test'
import {isHidden} from 'is-hidden'
import {remark} from 'remark'
import remarkDirective from '@aeharding/remark-lemmy-spoiler'
import {unified} from 'unified'

test('remarkDirective', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(
      Object.keys(await import('@aeharding/remark-lemmy-spoiler')).sort(),
      ['default']
    )
  })

  await t.test('should not throw if not passed options', async function () {
    assert.doesNotThrow(function () {
      remark().use(remarkDirective).freeze()
    })
  })
})

test('fixtures', async function (t) {
  const base = new URL('fixtures/', import.meta.url)
  const folders = await fs.readdir(base)

  let index = -1

  while (++index < folders.length) {
    const folder = folders[index]

    if (isHidden(folder)) continue

    await t.test(folder, async function () {
      const folderUrl = new URL(folder + '/', base)
      const inputUrl = new URL('input.md', folderUrl)
      const treeUrl = new URL('tree.json', folderUrl)

      const input = String(await fs.readFile(inputUrl))

      /** @type {import('mdast').Node} */
      let expected

      const proc = remark().use(remarkDirective)
      const remarkTree = proc.parse(input)

      const actual = unified().use(remarkDirective).runSync(remarkTree)

      try {
        if ('UPDATE' in process.env) {
          throw new Error('Updating…')
        }

        expected = JSON.parse(String(await fs.readFile(treeUrl)))
      } catch {
        expected = actual

        // New fixture.
        await fs.writeFile(treeUrl, JSON.stringify(actual, undefined, 2) + '\n')
      }

      assert.deepEqual(actual, expected)
    })
  }
})
