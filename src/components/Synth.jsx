import React from 'react'
import { useState } from 'react';
import { Grid } from '@mui/material';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

export default function Synth({synth}) {
  const [power, setPower]=useState(synth.power??false)
  const [oscType, setOscType]= useState(synth.oscillator.type??'')
  const [volLevel, setVolLevel]= useState(synth.volume.value??'')
  const [freqLevel, setFreqLevel]= useState(synth.frequency.value??'')
  const [detune, setDetune]= useState(synth.detune.value??'')
  const [phase, setPhase]= useState(synth.oscillator.phase??'')

  function formatVolume(volume) {
    if (volume<=.0001) {
      return -Infinity
    }
    return 20 * Math.log10(volume*4)
  }

  const updateSynth=(e)=>{
    const {value}=e.target
    let prop = e.target.id
    if ( prop==='oscillator') {
      synth[prop].type=value
        setOscType(value)
    } else if (prop==='phase') {
      synth.oscillator.phase=value
      setPhase(value)
    } else if (prop==='volume') {
      setVolLevel(value)
      synth.volume.value=formatVolume(value)
    } else if(prop === 'frequency'){
      synth[prop].value=value
      setFreqLevel(value)
    } else {
      synth[prop].value=value
    }

    switch (prop) {
      case 'detune':
        setDetune(value)
        break;
      default:
        break;
    }
  }

  const togglePower=async (e)=>{
    e.preventDefault()
    if(!power){
      await synth.triggerAttack(freqLevel)
      synth.power=true
      setPower(true)
    }else{
      await synth.triggerRelease()
      synth.power=false
      setPower(false)
    }
  }
  
  return (
    <Grid container alignItems='center' direction='column'>
      <Grid item>
      <PowerSettingsNewIcon  fontSize='large' className='pwr-btn' onClick={(e)=>togglePower(e)} color={(power?'success':'default')}/>
      </Grid>
      <Grid item>
        <select id='oscillator' value={oscType} onChange={(e)=>updateSynth(e)}>
        <option value='sine'> Sine</option>
        <option value='triangle'> Triangle</option>
        <option value='square'> Square</option>
        <option value='sawtooth'> Sawtooth</option>
      </select>
      </Grid>
      
      <Grid item container>
        <Grid item>
          <h6>Volume</h6>
          <input value={volLevel} max={1} min={0} step={.001} onChange={(e)=> updateSynth(e)} id='volume' type='range'/>
        </Grid>
        <Grid item>
          <h6>Frequency</h6>
          <input value={freqLevel} step={.00001} max={1000} min={15} onChange={(e)=> updateSynth(e)} id='frequency' type='range'/>
        </Grid>
        <Grid item>
          <h6>Detune</h6>
          <input value={detune} step={.1} min={'-100'} onChange={(e)=> updateSynth(e)} id='detune' type='range'/>
        </Grid>
        <Grid item>
          <h6>Phase</h6>
          <input value={phase} max={360} onChange={(e)=> updateSynth(e)} id='phase' type='range'/>
        </Grid>
      </Grid>
      
    </Grid>
  )
}
