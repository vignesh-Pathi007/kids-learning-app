$root = Join-Path $PSScriptRoot '..\assets\audio\numbers'
$root = [System.IO.Path]::GetFullPath($root)
New-Item -ItemType Directory -Force -Path $root | Out-Null

Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.Volume = 100
$synth.Rate = -2

$preferredFemale = $null
foreach ($voice in $synth.GetInstalledVoices()) {
    $voiceInfo = $voice.VoiceInfo
    if ($voiceInfo.Gender -eq [System.Speech.Synthesis.VoiceGender]::Female) {
        $preferredFemale = $voiceInfo.Name
        break
    }
}

if ($preferredFemale) {
    $synth.SelectVoice($preferredFemale)
}

function Get-NumberWord([int]$n) {
    if ($n -eq 0) { return 'Zero' }

    $ones = @('Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine')
    $teens = @('Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen')
    $tens = @('', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety')

    if ($n -lt 10) { return $ones[$n] }
    if ($n -lt 20) { return $teens[$n - 10] }
    if ($n -lt 100) {
        $ten = [Math]::Floor($n / 10)
        $rem = $n % 10
        if ($rem -eq 0) { return $tens[$ten] }
        return ($tens[$ten] + ' ' + $ones[$rem])
    }

    if ($n -eq 100) { return 'One Hundred' }
    return $n.ToString()
}

for ($i = 1; $i -le 100; $i++) {
    $word = Get-NumberWord $i
    $filePath = Join-Path $root ("{0}.wav" -f $i)
    $synth.SetOutputToWaveFile($filePath)
    $synth.Speak($word)
}

$synth.Dispose()
Write-Host "Generated 100 number audio files in $root"
