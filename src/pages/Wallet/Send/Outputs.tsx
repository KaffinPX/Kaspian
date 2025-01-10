import { PlusIcon, XIcon } from "lucide-react"

export type Output = [ string, string ]

export default function Outputs ({ outputs, setOutputs, readOnly }: {
  outputs: Output[],
  setOutputs: React.Dispatch<React.SetStateAction<Output[]>>,
  readOnly: boolean
}) {
  return (
    <ul className="list p-2 overflow-y-scroll h-24 items-center">
      {outputs.map((output, id) => {
        return (
          <li className="list-row items-center shadow-sm">
            <div className="flex flex-col gap-1">
              <input 
                className="input input-xs tracking-tighter"
                placeholder="Address(kaspa:)"
                value={output[0]}
                onChange={({ target }) => { 
                  setOutputs((prevOutputs) => {
                    prevOutputs[id][0] = target.value
                    return [ ...prevOutputs ]
                  })
                }}
                disabled={readOnly}
              />
              <input 
                type="number"
                className="input input-xs"
                placeholder="Amount"
                value={output[1]}
                min={0}
                onChange={({ target }) => { 
                  setOutputs((prevOutputs) => {
                    prevOutputs[id][1] = target.value
                    return [ ...prevOutputs ]
                  })
                }}
                disabled={readOnly}
              />
            </div>
            <button className="btn btn-square btn-xs" disabled={readOnly} onClick={() => {
              setOutputs((prevOutputs) => {
                prevOutputs.splice(id, 1)
                return [ ...prevOutputs ]
              })
            }}>
              <XIcon />
            </button>
          </li>
        )
      })}
      <button className="btn btn-neutral btn-xs mt-1" disabled={readOnly} onClick={() => {
        setOutputs((prevOutputs) => {
          prevOutputs.push([ "", "" ])
          return [ ...prevOutputs ]
        })
      }}>
        <PlusIcon />
        New output
      </button>
    </ul>
  )
}