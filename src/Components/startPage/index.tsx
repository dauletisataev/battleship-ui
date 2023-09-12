import { deployGame } from "@/helpers/game";
import { getCurrentUser } from "@/helpers/utils";
import { Box, Button, Stack, TextInput } from "@mantine/core";
import { useState, useEffect } from "react";

const StartPage = () => {
  const [enemyAddress, setEnemyAddress] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGameStart = async () => {
    setLoading(true);
    console.log("currentUser", currentUser.address);
    console.log("enemyAddress", enemyAddress);

    const gameAddress = await deployGame(enemyAddress, currentUser.privateKey);
    console.log(gameAddress);

    //redirect to /game/[address]
    window.location.href = `/game/${gameAddress}`;
  };

  useEffect(() => {
    const initCurrentUserAddress = async () => {
      const wallet = await getCurrentUser();
      setCurrentUser(wallet);
    };
    initCurrentUserAddress();
  }, []);

  return (
    <div
      className="main-theme"
      style={{
        backgroundImage: `url("../../assets/images/main-theme.jpeg")`,
      }}
    >
      <Stack align="center">
        <h1>Start Game</h1>
        <h2>Current user: {currentUser && currentUser.address}</h2>
        <Box
          maw={300}
          mx="auto"
          mt={200}
          bg="white"
          p={12}
          sx={{
            borderRadius: 10,
          }}
        >
          <TextInput
            size="lg"
            withAsterisk
            label="Enemy address"
            placeholder="0x000000000"
            value={enemyAddress}
            onChange={(event) => setEnemyAddress(event.currentTarget.value)}
          />
          <Button onClick={handleGameStart} loading={loading}>
            Start game
          </Button>
        </Box>
      </Stack>
    </div>
  );
};

export default StartPage;
