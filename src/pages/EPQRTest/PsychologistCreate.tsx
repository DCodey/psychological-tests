// src/pages/PsychologistCreate.tsx (esqueleto)
import React, { useState } from "react";
import { generateRsaKeyPair, wrapPrivateKeyWithPassphrase } from "../utils/crypto";
import { v4 as uuidv4 } from "uuid";

export default function PsychologistCreate() {
  const [name,setName] = useState("");
  const [age,setAge] = useState("");
  const [pass,setPass] = useState("");
  const [urlA,setUrlA] = useState("");

  async function handleCreate(e:React.FormEvent) {
    e.preventDefault();
    const pair = await generateRsaKeyPair();
    const wrapped = await wrapPrivateKeyWithPassphrase(pair.privateKeyRaw, pass);
    const sessionId = uuidv4();
    // make URL_A
    const qs = new URLSearchParams({
      session: sessionId,
      name,
      age,
      pub: pair.publicKeyPemBase64Url
    }).toString();
    const url = `${location.origin}/fill?${qs}`;
    setUrlA(url);
    // offer to download wrapped
    const blob = new Blob([JSON.stringify(wrapped)], {type: "application/json"});
    const urlDl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = urlDl;
    a.download = `privkey_${sessionId}.enc.json`;
    a.click();
  }

  return (
    <form onSubmit={handleCreate}>
      {/* inputs name, age, pass; show urlA when ready */}
    </form>
  );
}
