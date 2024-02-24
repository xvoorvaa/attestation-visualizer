"use client";

import React, { useState, useCallback } from "react";
import SidebarComponent from "@/components/Layout/SideBarComponent";
import ThreeGraph from "@/components/ThreeGraphWrapper";
import { mainnet, WagmiConfig, createConfig } from "wagmi";
import { createPublicClient, http } from "viem";
import ListView from "@/components/views/List/ListView";
import GridView from "@/components/views/Grid/GridView";
import CreditsView from "@/components/views/Credits/CreditsView";
import GraphDataProvider from "@/components/context/GraphDataContext";
import RoundDropdown from "@/components/RoundDropdown";
import { ActiveView } from "@/lib/types";
import useIsMobile from "@/components/Layout/useIsMobile";

const Home = () => {
  const isMobile = useIsMobile();
  const [activeView, setActiveView] = useState<ActiveView>(ActiveView.None);
  const [round, setRound] = useState(3);

  const handleSelectRound = useCallback((selectedRound: number) => {
    setRound(selectedRound);
  }, []);

  const handleItemClick = (view: ActiveView) => {
    if (activeView === view) {
      setActiveView(ActiveView.None);
    } else {
      setActiveView(view);
    }
  };

  const handleRoute = useCallback((href: string) => {
    window.open(href, "_blank");
  }, []);

  const configWagmi = createConfig({
    autoConnect: true,
    publicClient: createPublicClient({
      chain: mainnet,
      transport: http(),
    }),
  });

  if (isMobile) {
    return (
      <div className="flex justify-center text-xl text-white">
        Mobile version not supported.
      </div>
    );
  }

  return (
    <WagmiConfig config={configWagmi}>
      <GraphDataProvider round={round}>
        <main className="flex">
          <SidebarComponent
            handleRoute={handleRoute}
            activeView={activeView}
            handleItemClick={handleItemClick}
          />
          <div
            className={`w-[35rem] relative ${activeView === ActiveView.None ? "z-0" : "z-10"
              }`}
          >
            {activeView === ActiveView.Grid && <GridView />}
            {activeView === ActiveView.List && <ListView />}
            {activeView === ActiveView.Credits && <CreditsView />}
          </div>
          <RoundDropdown round={round} handleSelectRound={handleSelectRound} />
          <div className="absolute">
            <ThreeGraph />
          </div>
        </main>
      </GraphDataProvider>
    </WagmiConfig>
  );
};

export default Home;
