import { OnRpcRequestHandler } from '@metamask/snap-types';


async function getPrices() {
  const response = await fetch('https://api.coincap.io/v2/assets?limit=10'); 
  return response.text(); 
}
/**
 * Get a message from the origin. For demonstration purposes only.
 *
 * @param originString - The origin string.
 * @returns A message based on the origin.
 */
export const getMessage = (originString: string): string =>
  `Hello, ${originString}!`;

  
/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns `null` if the request succeeded.
 * @throws If the request method is not valid for this snap.
 * @throws If the `snap_confirm` call failed.
 */
export const onRpcRequest: OnRpcRequestHandler = ({ origin, request }) => {
  switch (request.method) {
    case 'fees':
      return getPrices().then(fees => {
        const pricesObject = JSON.parse(fees).data; 
        let prices = '';
        for(let f in pricesObject){
          let individualData = pricesObject[parseInt(f)];
          prices += `${individualData.symbol} ${individualData.priceUsd} USD\n`;
        }
        return wallet.request({
          method: 'snap_confirm', 
          params: [
            {
              prompt: getMessage(origin),
              description:
                'Top 10 prices',
              textAreaContent:
              prices
            }
          ]
        }); 
      })}};