// src/pages/PsychologistCreate.tsx (esqueleto)
import React, { useState } from "react";
import { generateRsaKeyPair, wrapPrivateKeyWithPassphrase } from "../../utils/crypto";
import { v4 as uuidv4 } from "uuid";

export default function PsychologistCreate() {
  const [name,setName] = useState("");
  const [age,setAge] = useState("");
  const [pass,setPass] = useState("");

  async function handleCreate(e:React.FormEvent) {
    e.preventDefault();
    const pair = await generateRsaKeyPair();
    const wrapped = await wrapPrivateKeyWithPassphrase(pair.privateKeyRaw, pass);
    const sessionId = uuidv4();
    
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
      <input type="text" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="Edad" value={age} onChange={(e) => setAge(e.target.value)} />
      <input type="password" placeholder="Contraseña" value={pass} onChange={(e) => setPass(e.target.value)} />
      <button type="submit">Crear Test</button>
    </form>
  );
}
