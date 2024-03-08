import Heading from "@/components/Heading";
import { Button } from "@/components/ui/button";
import { UnlockKeyhole } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { i18n } from "webextension-polyfill";
import useKaspa from "@/hooks/useKaspa";
import { Label } from "@radix-ui/react-label";

export default function UnlockWallet() {
  const navigate = useNavigate();
  const kaspa = useKaspa();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const unlockWallet = useCallback(() => {
    setPassword("");

    kaspa.request('wallet:unlock', [password]).then(() => {
      navigate("/");
    }).catch((err) => {
      setError(err.message || err.toString());
    });
  }, [password, kaspa, navigate]);

  return (
    <main className={"flex flex-col justify-between min-h-screen py-6"}>
      <Heading
        title={"Kaspian"}
        subtitle={i18n.getMessage('unlockIntro')}
      />
      <div className={"mx-auto"}>
        <Input
          type={"password"}
          placeholder={i18n.getMessage('password')}
          className={"w-72"}
          value={password}
          onChange={e => {
            if (error) setError("");
            setPassword(e.target.value);
          }}
          onKeyUp={e => {
            if (e.key === 'Enter' && password) {
              unlockWallet();
            }
          }}
        />
        <p className="text-red-600">{error}</p>
      </div>
      <div className={"mx-auto"}>
        <Button className={"gap-2"} disabled={!password} onClick={unlockWallet}>
          <UnlockKeyhole />
          {i18n.getMessage('unlock')}
        </Button>
      </div>
    </main>
  );
}