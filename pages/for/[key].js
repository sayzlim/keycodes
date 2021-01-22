import slugify from '@sindresorhus/slugify';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import EventCollection from '../../components/EventCollection';
import { useKeyCode } from '../../components/KeyCodeProvider';
import MetaKeys from '../../components/MetaKeys';
import { getOppositeCase } from '../../lib/caseUtils';
import { findSimilarKeys } from '../../lib/findSimilarKeys';
import { keyCodes, keyLocations } from '../../lib/keycodes';
import { keyCodesWithEvents } from '../../lib/keyCodesWithEvents';

export default function HomePage({ staticKey }) {
  const { query } = useRouter();
  const { key: generatedKey } = useKeyCode();
  // Here we decide if we should show the code info from the users keyboard, or from our database of keys
  // The user's key is favourable, but if they are visiting the page directly, then we use the static key
  const key = generatedKey.key ? generatedKey : staticKey;
  const hasKeyToShow = key.key === undefined;
  const similarKeys = findSimilarKeys(key);
  return (
    <>
      <Head>
        <title>JavaScript Keycode - {query.key}</title>
      </Head>
      <div className="wrap" aria-live="polite" aria-atomic="true">
        <p className="keycode-display huge">{key.keyCode}</p>
        <p className={`text-display ${!hasKeyToShow && 'hide'}`}>
          Press any key to get the JavaScript event keycode
        </p>
        <div className="cards">
          <div className="card item-key">
            <div className="card-header">
              <span>event.key</span> <small>(Value of Key)</small>
            </div>
            <div className="card-main">
              <div className="main-description">
                {key.key}
                {key.key === ' ' && <small>(blank space)</small>}
              </div>
            </div>
            <footer>
              <p>
                The value of the key pressed. Accounts for modifiers keys that
                return CAPS and alternate chars.
              </p>
            </footer>
          </div>
          <div className="card item-location">
            <div className="card-header">event.location</div>
            <div className="card-main">
              <div className="main-description">
                {keyLocations[key.location]}
                <small>({key.location})</small>
              </div>
            </div>
            <footer>
              <p>
                Some keys exist more than once on your keyboard. This provides
                the location of the key pressed. Try it with both shifts.{' '}
                <a
                  href="https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/location"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  More here
                </a>
              </p>
            </footer>
          </div>
          <div className="card item-code">
            <div className="card-header">
              event.code
              <small>(Physical Key)</small>
            </div>
            <div className="card-main">
              <div className="main-description">{key.code}</div>
            </div>
            <footer>
              <p>
                The physical key on the keyboard. Doesn't care if you are
                holding a modifier like Shift.
              </p>
            </footer>
          </div>
          <div className="card item-which">
            <div className="card-header">event.which</div>
            <div className="card-main">
              <div className="main-description">{key.which}</div>
            </div>
            <footer>
              <p>
                event.which and event.keyCode are{' '}
                <a
                  href="https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  (deprecated)
                </a>{' '}
                in modern browsers. Use <code>.key</code> or <code>.code</code>{' '}
                instead.
              </p>
            </footer>
          </div>
          <div className="card item-description">
            <div className="card-header">Description</div>
            <div className="card-main">
              <div className="main-description">
                {keyCodesWithEvents[key.keyCode]?.description ||
                  'No Description. Add one?'}
              </div>
            </div>
            <footer>
              <p>
                This is the description we have created. Think it can be
                improved?{' '}
                <a href="github.com/wesbos/keycodes">PR us on GitHub</a>
              </p>
            </footer>
          </div>
          <MetaKeys currentKey={key} />
          <div className="card item-event">
            <div className="card-header">Event Dump</div>
            <div className="card-main">
              <pre>{JSON.stringify(key, '', ' ')}</pre>
            </div>
          </div>
          <div className="card item-similar">
            <div className="card-header">Similar Values</div>
            <div className="card-main">
              <ul>
                {similarKeys.map((key) => (
                  <li key={key.keyCode}>
                    <a href={`/for/${key.code}`}>{key.code}</a>
                    <a href={`/for/${key.keyCode}`}>({key.keyCode})</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="card item-unicode">
            <div className="card-header">Unicode</div>
            <div className="card-main">
              {keyCodesWithEvents[key.keyCode]?.unicode || ' '}
            </div>
          </div>
        </div>
        <div className="mobile-input" />
      </div>

      <span className="love">
        Made with love by
        <a href="https://wesbos.com" target="_blank" rel="noopener">
          Wes Bos
        </a>{' '}
        — fork or suggest edits on
        <a
          href="https://github.com/wesbos/keycodes"
          target="_blank"
          rel="noopener"
        >
          GitHub
        </a>{' '}
        —
        <a
          href="https://twitter.com/wesbos"
          className="twitter-follow-button"
          data-show-count="false"
          target="_blank"
          rel="noopener noreferrer"
        >
          Follow @wesbos
        </a>
        <a
          href="https://twitter.com/share"
          className="twitter-share-button"
          data-url="https://keycode.info"
          data-text="Nice tool for finding JavaScript event keycodes"
          data-via="wesbos"
          data-related="wesbos"
          target="_blank"
          rel="noopener noreferrer"
        >
          Tweet
        </a>
      </span>
    </>
  );
}

export function getStaticPaths() {
  console.log('Getting Static Paths');
  const keyEvents = Object.values(keyCodesWithEvents);
  // Get the keys as is
  const keys = keyEvents
    .map((key) => key.key)
    .filter(Boolean)
    .filter((key) => key !== ' ')
    .map((key) => key.toString());
  const oppositeCaseKeys = keys.map((key) => getOppositeCase(key));
  const codes = keyEvents.map((key) => key.code).filter(Boolean);
  const keyCodes = keyEvents.map((key) => key.keyCode).filter(Boolean);
  const keyDescriptions = keyEvents
    .map((key) => key.description)
    .filter(Boolean)
    .map(slugify);
  const deDuped = Array.from(
    new Set([keys, oppositeCaseKeys, codes, keyCodes, keyDescriptions].flat())
  );
  const paths = deDuped.map((key) => ({
    params: {
      // account for numbers, must be a string
      key: key.toString(),
    },
  }));
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { key } = params;
  function getKeyData(search) {
    // 1. Search for a key the `key` property
    const keys = Object.values(keyCodesWithEvents);
    const keyWithKey = keys.find((x) => x.key === key);
    if (keyWithKey) {
      return keyWithKey;
    }
    // 2. Search for a key the `key` lowercase / uppercase opposite version
    const oppositeCase = getOppositeCase(key);
    const keyWithLowercase = keys.find((x) => x.key === oppositeCase);
    if (keyWithLowercase) {
      return keyWithLowercase;
    }
    // 3. If it's a .code (Num4), find it
    const keyWithCode = keys.find((x) => x.code === key);
    if (keyWithCode) return keyWithCode;

    // 4. If it's a number search for a key with the keycode
    const numberCode = parseInt(key);
    if (numberCode) {
      const keyWithNumber = keys.find((x) => x.keyCode === numberCode);
      if (keyWithNumber) {
        return keyWithNumber;
      }
    }
    // 5. Search for a key with this description slug
    const keyWithSlug = keys
      .filter((x) => x.description)
      .find((x) => slugify(x.description) === key);
    if (keyWithSlug) {
      return keyWithSlug;
    }
    return {};
  }

  return {
    props: {
      staticKey: getKeyData(key),
    },
  };
}