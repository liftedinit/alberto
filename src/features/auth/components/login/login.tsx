// @ts-nocheck
import React from "react"
import { Button, Layout } from "components"
import { WebAuthnIdentity } from "@liftedinit/many-js"

// http://localhost:3000
// const base64CredId =
//   "AbT4G2YxQZbKAbxRbEl/aROFPIFvsa8bVgU/uviVsdpLv7A6c2xBDi9Kbka+pmv/EhIv3v/juoMuTizPeNNqr2LJnZfq4w0DXUauCwVi1g=="
// const base64CredIdYubiKey =
//   "2ocuOqvZznstg9utBTa1pHB/mivWE7ICh1fyd15x0d0V1eW9EExAkZirx5AtubhLix+0VHQB4xPZ1G3RlzqRDg=="
const base64CredIdYubiKey =
  "CcMYakRFHEDJhKrEw82OC68YVZLAn3WaKn2yJY5eUdy/VfAwCiSzMPYtwkzCq3CYh0pnBI0lRLo9WRfmpHoiQw=="
// https://localhost:3000
// const base64CredId =
//   "AVOPpURr1GNgMlLT6KQJvI8jqo3FrkMP/B4cqJO/WK/4Bf0ioRe1pc7rHNssijGvjiafQRCUHDLNyNQU5gyItCFeFMaxEdrJCiP0ZcLZlw=="

// const base64PubKey =
//   "pQECAyYgASFYICxhtmgl15h+W/sAbsdHtaNYl2G+osNQMJM/QcjDus5TIlggEBuMIFiF7s1LA6rE10+fstw07Nfb/oCRWV+20tmoSKI="

export function Login() {
  const [identity, setIdentity] = React.useState<any>()

  function create() {
    WebAuthnIdentity.createCredential()
      .then(webAuthnIdentity => {
        console.log({ webAuthnIdentity })

        if (webAuthnIdentity.rawId) {
          const base64CredId = window.btoa(
            String.fromCharCode(...new Uint8Array(webAuthnIdentity.rawId)),
          )
          console.log({ base64CredId })
          const base64PublicKey = window.btoa(
            String.fromCharCode(...new Uint8Array(webAuthnIdentity.publicKey)),
          )
          console.log({ base64PublicKey })
          setIdentity(webAuthnIdentity)
        }
      })
      .catch(e => {
        console.log("create error", e)
      })
  }

  async function sign() {
    const result = await identity?.sign(
      new ArrayBuffer(32),
      // Uint8Array.from(atob(base64CredIdYubiKey), c => c.charCodeAt(0)),
    )

    console.log("sign result:", { result })
  }

  async function retrieve() {
    const challenge = window.crypto.getRandomValues(new Uint8Array(32))
    const result = await WebAuthnIdentity.getCredential({
      challenge,
      allowCredentials: [
        {
          id: Uint8Array.from(atob(base64CredIdYubiKey), c => c.charCodeAt(0)),
          type: "public-key",
        },
      ],
    })
    console.log("get result", { result })
  }

  console.log({ identity })

  return (
    <Layout.Main>
      <Button onClick={sign} mr={2}>
        Sign
      </Button>
      <Button onClick={retrieve} mr={2}>
        Retrieve
      </Button>
      <Button onClick={create}>Create</Button>
    </Layout.Main>
  )
}
