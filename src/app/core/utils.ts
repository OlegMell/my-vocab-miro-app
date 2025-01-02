export const getNavigatorLanguage = () => ( navigator.languages && navigator.languages.length )
    ? navigator.languages[ 0 ].substring( 0, 2 ) : navigator.language || 'en';