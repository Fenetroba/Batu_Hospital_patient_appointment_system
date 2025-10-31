import React from 'react'
import { Switch } from '@/components/ui/switch'

// Reusable controlled status switch
// Props: checked (boolean), onChange (function)
const StatusSwitch = ({ checked, onChange }) => {

  return (
    <Switch
      checked={checked}
      onCheckedChange={onChange}
      aria-label="Toggle status"
     
     
    />
  )
}

export default StatusSwitch