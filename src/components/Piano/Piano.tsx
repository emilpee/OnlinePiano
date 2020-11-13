import React, {
  FunctionComponent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Howl, Howler } from 'howler'
import pianoData from './data/pianoData.json'
import PianoContainer from './components/PianoContainer'
import PianoKey from './components/PianoKey'
import PianoVolume from './components/PianoVolume'
import PianoVolumeDisplay from './components/PianoVolumeDisplay'
import PianoMenu from './components/PianoMenu'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  main: {
    flex: 6,
    flexDirection: 'column',
  },
  pianoContainer: {
    borderRadius: theme.shape.borderRadius,
    backgroundColor: '#222',
    display: 'flex',
    margin: theme.spacing(5),
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(5),
    minWidth: 1200,
  },
  pianoKeys: {
    display: 'flex',
    marginRight: theme.spacing(4),
  },
  singlePianoKey: {
    borderLeft: '1px solid #333',
    borderBottomLeftRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
    cursor: 'pointer',
    listStyle: 'none',
  },
  pianoVolumes: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    marginRight: theme.spacing(5),
    minWidth: 120,
  },
  black: {
    background: '#333',
    height: 128,
    marginLeft: -16,
    minWidth: 28,
    zIndex: 1,
    '&:active': {
      background: 'linear-gradient(to top, #444 0%, #333 100%)',
    },
    '&:focus': {
      outline: 'none',
    },
  },
  white: {
    background: '#fff',
    height: 256,
    minWidth: 56,
    marginLeft: -16,
    '&:active': {
      background: 'linear-gradient(to bottom, #fff 0%, #e6e6e6 100%)',
    },
    '&:focus': {
      outline: 'none',
    },
  },
  margin: {
    marginRight: 8,
  },
}))

const Piano: FunctionComponent = () => {
  const [volume, setVolume] = useState<number>(1)
  const [isChecked, setIsChecked] = useState<boolean>(false)
  const pianoKeyRef = useRef(null)

  useEffect(() => {
    Howler.volume(Math.round(volume * 10) / 10)
  }, [volume])

  const handleKeyClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    event.persist()

    let pianoNote = (event.target as Element).id
    let sound = new Howl({
      src: [`/audio/${pianoNote}.mp3`],
    })

    sound.play()
  }

  const handleKeyboardClick = (
    event: React.KeyboardEvent<HTMLButtonElement>,
  ): void => {
    let keyName = event.key
    let pressedKey = pianoData.find(
      (key) => key.keyboardKey === keyName,
    )

    if (pianoKeyRef.current !== null) {
      pianoKeyRef?.current.focus()
      // pianoKeyRef.current.style.backgroundColor = 'black'
    }

    let sound = new Howl({
      src: [`/audio/${pressedKey?.key}.mp3`],
    })

    if (pressedKey) {
      sound.play()
    } else {
      return
    }
  }

  const handlePianoVolume = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const buttonType = event.currentTarget as HTMLButtonElement

    if (buttonType.id === 'inc' && volume < 1) {
      setVolume((volume) => volume + 0.1)
    } else if (buttonType.id === 'dec' && volume > 0.1) {
      setVolume((volume) => volume - 0.1)
    }
  }

  const handleSwitchCheck = () => setIsChecked(!isChecked)

  const classes = useStyles()

  return (
    <section className={classes.main}>
      <PianoMenu onChange={handleSwitchCheck} isChecked={isChecked} />
      <PianoContainer className={classes.pianoContainer}>
        <div className={classes.pianoVolumes}>
          <PianoVolumeDisplay volume={volume} />
          <PianoVolume
            id="inc"
            color="primary"
            handlePianoVolume={handlePianoVolume}
          >
            +
          </PianoVolume>
          <PianoVolume
            id="dec"
            color="secondary"
            handlePianoVolume={handlePianoVolume}
          >
            -
          </PianoVolume>
        </div>
        <div className={classes.pianoKeys}>
          {pianoData.map((pianoKey) => (
            <PianoKey
              onKeyClick={handleKeyClick}
              onKeyboardPress={handleKeyboardClick}
              keyboardKey={pianoKey.keyboardKey}
              key={pianoKey.key}
              id={pianoKey.key}
              className={`${classes.singlePianoKey} 
                ${
                  pianoKey.key.includes('b') ||
                  pianoKey.key.includes('e')
                    ? classes.margin
                    : ''
                }
                ${
                  pianoKey.type === 'black'
                    ? classes.black
                    : classes.white
                }`}
              tabIndex={0}
              isChecked={isChecked}
            />
          ))}
        </div>
      </PianoContainer>
    </section>
  )
}

export default Piano
