import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Input,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { useState } from 'react';

function App() {
  const [userAddress, setUserAddress] = useState('');
  const [results, setResults] = useState([]);
  const [hasQueried, setHasQueried] = useState(false);
  const [tokenDataObjects, setTokenDataObjects] = useState([]);

  async function getTokenBalance() {
    const config = {
      apiKey: 'ohn4Q_1eiui7MhHizLJZ5FaAX1buqHVB',
      network: Network.ETH_MAINNET,
    };

    const alchemy = new Alchemy(config);
    const data = await alchemy.core.getTokenBalances(userAddress);
    //console.log(data);

    const tokenDataPromises = [];
    const _promises = [];

    for (let i = 0; i < data.tokenBalances.length; i++) {
      const tokenData = alchemy.core.getTokenMetadata(
        data.tokenBalances[i].contractAddress
      ).then(v => { tokenDataPromises[data.tokenBalances[i].contractAddress] = v })
        .catch(e => console.log(e));
      _promises.push(tokenData);
    }

    setResults(data);
    await Promise.all(_promises);
    setTokenDataObjects(tokenDataPromises);
    setHasQueried(true);
  }
  return (
    <Box w="100vw">
      <Center>
        <Flex
          alignItems={'center'}
          justifyContent="center"
          flexDirection={'column'}
        >
          <Heading mb={0} fontSize={36}>
            ERC-20 Token Indexer
          </Heading>
          <Text>
            Plug in an address and this website will return all of its ERC-20
            token balances!
          </Text>
        </Flex>
      </Center>
      <Flex
        w="100%"
        flexDirection="column"
        alignItems="center"
        justifyContent={'center'}
      >
        <Heading mt={42}>
          Get all the ERC-20 token balances of this address:
        </Heading>
        <Input
          onChange={(e) => setUserAddress(e.target.value)}
          color="black"
          w="600px"
          textAlign="center"
          p={4}
          bgColor="white"
          fontSize={24}
          name="ethAddress"
          id="ethAddress"
        />
        <Button fontSize={20} onClick={getTokenBalance} mt={36} bgColor="blue">
          Check ERC-20 Token Balances
        </Button>

        <Heading my={36}>ERC-20 token balances:</Heading>

        {hasQueried ? (
          <SimpleGrid w={'90vw'} columns={4} spacing={24}>
            {results.tokenBalances.map((e) => {
              //console.log(e.contractAddress + " : " + tokenDataObjects[e.contractAddress].symbol + " decimals : " + tokenDataObjects[e.contractAddress].decimals);
              //console.log(tokenDataObjects[e.contractAddress]);
              return tokenDataObjects[e.contractAddress] ? (
                <Flex
                  flexDir={'column'}
                  color="white"
                  bg="ffffff"
                  w={'20vw'}
                  key={e.contractAddress}
                >
                  <Box>
                    <b>Symbol:</b> ${tokenDataObjects[e.contractAddress].symbol}&nbsp;
                  </Box>
                  <Box>
                    <b>Balance:</b>&nbsp;
                    {Utils.formatUnits(
                      e.tokenBalance,
                      tokenDataObjects[e.contractAddress].decimals
                    )}
                  </Box>
                  <Image 
                    borderRadius='100%'
                    boxSize='50px'
                    src={tokenDataObjects[e.contractAddress].logo} />
                </Flex>
              )
                : <Flex><Box>{e.contractAddress}</Box></Flex>;
            })}
          </SimpleGrid>
        ) : (
          'Please make a query! This may take a few seconds...'
        )}
      </Flex>
    </Box>
  );
}

export default App;
