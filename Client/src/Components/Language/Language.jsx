import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { languages } from "../Language/languages";
import { useLanguage } from '@/Context/LanguageContext';

const Language = () => {
  const { currentLanguage, changeLanguage, t } = useLanguage();

  return (
    <div>
         <Select 
           className="w-[180px]" 
           value={currentLanguage}
           onValueChange={changeLanguage}
         >
          <SelectTrigger className='text-white'>
            <SelectValue placeholder={t('language')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english">{languages.english.name}</SelectItem>
            <SelectItem value="amharic">{languages.amharic.name}</SelectItem>
            <SelectItem value="afanOromo">{languages.afanOromo.name}</SelectItem>
          </SelectContent>
        </Select>
    </div>
  )
}

export default Language