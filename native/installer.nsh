!macro customUnInstall
  ; Only Cypher's own per-user startup registration. User profile data is retained.
  ${ifNot} ${isUpdated}
    DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "Cypher"
  ${endif}
!macroend
