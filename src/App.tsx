import React, { useState, useEffect } from 'react';
import {
  Firm,
  Lad,
  Fixture,
  Tactics,
  AwayTravelPlan,
  TerritoryLocation,
  TerraceNews,
  ClashOutcome,
  GameSaveState
} from './types/game';
import {
  INITIAL_FIRMS,
  INITIAL_LADS,
  INITIAL_FIXTURES,
  INITIAL_TERRITORIES,
  INITIAL_NEWS,
  DEFAULT_TACTICS,
  DEFAULT_AWAY_PLAN
} from './data/initialData';
import { Navbar, ActiveTab } from './components/Navbar';
import { OfficeView } from './components/OfficeView';
import { SquadView } from './components/SquadView';
import { TacticsView } from './components/TacticsView';
import { AwayTravelPlanner } from './components/AwayTravelPlanner';
import { LeagueView } from './components/LeagueView';
import { PubHqView } from './components/PubHqView';
import { CityView } from './components/CityView';
import { ClashEngine } from './components/ClashEngine';
import { PostClashReport } from './components/PostClashReport';
import { ClubSelectModal } from './components/ClubSelectModal';
import { FirmPhoneCallOverlay } from './components/FirmPhoneCallOverlay';
import { sound } from './services/sound';
import { CityState, CityVenue } from './types/city';
import { generateInitialCityState } from './data/cityData';
import { FirmClashEvent } from './types/firmIntegration';
import { Sparkles } from 'lucide-react';

const STORAGE_KEY = 'firm_u_lator_save_sfs_v2';

export default function App() {
  // Game State
  const [activeTab, setActiveTab] = useState<ActiveTab>('office');
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());

  const [firms, setFirms] = useState<Firm[]>(INITIAL_FIRMS);
  const [playerFirmId, setPlayerFirmId] = useState<string>('firm_northwood');
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [treasury, setTreasury] = useState<number>(750);
  const [policeHeat, setPoliceHeat] = useState<number>(35);
  const [respect, setRespect] = useState<number>(540);
  const [loyaltyIndex, setLoyaltyIndex] = useState<number>(88);

  const [lads, setLads] = useState<Lad[]>(INITIAL_LADS);
  const [tactics, setTactics] = useState<Tactics>(DEFAULT_TACTICS);
  const [awayPlan, setAwayPlan] = useState<AwayTravelPlan>(DEFAULT_AWAY_PLAN);
  const [fixtures, setFixtures] = useState<Fixture[]>(INITIAL_FIXTURES);
  const [territories, setTerritories] = useState<TerritoryLocation[]>(INITIAL_TERRITORIES);
  const [news, setNews] = useState<TerraceNews[]>(INITIAL_NEWS);
  const [cityState, setCityState] = useState<CityState>(() => {
    const firm = INITIAL_FIRMS.find(f => f.id === playerFirmId) || INITIAL_FIRMS[0];
    return generateInitialCityState(firm.city, firm.footballClub, 75);
  });

  // Modals & Overlays
  const [isClubModalOpen, setIsClubModalOpen] = useState<boolean>(false);
  const [incomingCall, setIncomingCall] = useState<{
    callerName: string;
    callerNickname: string;
    situation: string;
  } | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Clash Execution State
  const [isClashActive, setIsClashActive] = useState<boolean>(false);
  const [currentOutcome, setCurrentOutcome] = useState<ClashOutcome | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: GameSaveState = JSON.parse(saved);
        if (parsed.playerFirmId && INITIAL_FIRMS.some(f => f.id === parsed.playerFirmId)) {
          setPlayerFirmId(parsed.playerFirmId);
        }
        setCurrentRound(parsed.currentRound || 1);
        setTreasury(parsed.treasury || 750);
        setPoliceHeat(parsed.policeHeat || 35);
        setRespect(parsed.respect || 540);
        setLoyaltyIndex(parsed.loyaltyIndex || 88);
        if (parsed.lads && parsed.lads.length > 0) setLads(parsed.lads);
        if (parsed.tactics) setTactics(parsed.tactics);
        if (parsed.awayTravelPlan) setAwayPlan(parsed.awayTravelPlan);
        if (parsed.fixtures && parsed.fixtures.length > 0) setFixtures(parsed.fixtures);
        if (parsed.territories && parsed.territories.length > 0) setTerritories(parsed.territories);
        if (parsed.news && parsed.news.length > 0) setNews(parsed.news);
        if (parsed.cityState) setCityState(parsed.cityState);
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Save to local storage
  const saveGameState = () => {
    try {
      const state: GameSaveState = {
        playerFirmId,
        currentRound,
        treasury,
        policeHeat,
        respect,
        loyaltyIndex,
        lads,
        tactics,
        awayTravelPlan: awayPlan,
        fixtures,
        territories,
        news,
        clashHistory: [],
        cityState
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage errors
    }
  };

  useEffect(() => {
    saveGameState();
  }, [playerFirmId, currentRound, treasury, policeHeat, respect, loyaltyIndex, lads, tactics, awayPlan, fixtures, territories, news, cityState]);

  // Derive Current Fixture & Rival
  const playerFirm = firms.find(f => f.id === playerFirmId) || firms[0];
  const activeFixture = fixtures.find(f => f.round === currentRound && !f.clashPlayed);
  const rivalFirmId = activeFixture
    ? activeFixture.homeFirmId === playerFirm.id
      ? activeFixture.awayFirmId
      : activeFixture.homeFirmId
    : undefined;
  const rivalFirm = firms.find(f => f.id === rivalFirmId);

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleUpdateLad = (updatedLad: Lad) => {
    setLads(prev => prev.map(l => (l.id === updatedLad.id ? updatedLad : l)));
  };

  const handleDeductTreasury = (amount: number, reason: string): boolean => {
    if (treasury < amount) return false;
    setTreasury(prev => prev - amount);
    return true;
  };

  const handleUpgradeTerritory = (terrId: string, cost: number) => {
    if (treasury < cost) return;
    setTreasury(prev => prev - cost);
    setTerritories(prev =>
      prev.map(t => (t.id === terrId ? { ...t, defenseLevel: Math.min(5, t.defenseLevel + 1), weeklyRevenue: t.weeklyRevenue + 60 } : t))
    );
  };

  const handleRecruitLad = (newLad: Lad, cost: number) => {
    if (treasury < cost) return;
    setTreasury(prev => prev - cost);
    setLads(prev => [newLad, ...prev]);
  };

  const handlePurchaseUpgrade = (name: string, cost: number) => {
    if (treasury < cost) return;
    setTreasury(prev => prev - cost);
    setRespect(prev => prev + 25);
  };

  // Switching SFS club
  const handleSelectClub = (firmId: string) => {
    const newFirm = firms.find(f => f.id === firmId);
    if (!newFirm) return;

    setPlayerFirmId(firmId);
    setRespect(newFirm.respect);
    setLoyaltyIndex(newFirm.loyaltyIndex);

    // Update Home Territory to new stronghold
    setTerritories(prev => [
      {
        id: `terr_${firmId}_hq`,
        name: `${newFirm.pubStronghold} (HQ)`,
        description: `Sacred meeting stronghold for the ${newFirm.name}.`,
        controlledBy: firmId,
        defenseLevel: 4,
        weeklyRevenue: 450,
        strategicBonus: '+15% Bottle on home turf'
      },
      ...prev.slice(1)
    ]);

    // Retarget fixtures so player firm is the protagonist
    const rivalCandidates = firms.filter(f => f.id !== firmId);
    const updatedFixtures: Fixture[] = [
      {
        id: 'fix_1',
        round: 1,
        homeFirmId: firmId,
        awayFirmId: rivalCandidates[0]?.id || 'firm_kingsbridge',
        venueName: `${newFirm.city} High St & Station Concourse`,
        location: `${newFirm.city} (${newFirm.region})`,
        footballFixture: `${newFirm.footballClub} vs ${rivalCandidates[0]?.footballClub || 'Kingsbridge Ath.'}`,
        clashPlayed: false
      },
      {
        id: 'fix_2',
        round: 2,
        homeFirmId: rivalCandidates[1]?.id || 'firm_westport',
        awayFirmId: firmId,
        venueName: `${rivalCandidates[1]?.stadium || 'Away Ground'} Approach`,
        location: `${rivalCandidates[1]?.city || 'Westport'} (${rivalCandidates[1]?.region || 'Coastal'})`,
        footballFixture: `${rivalCandidates[1]?.footballClub || 'Westport City'} vs ${newFirm.footballClub}`,
        clashPlayed: false
      },
      {
        id: 'fix_3',
        round: 3,
        homeFirmId: firmId,
        awayFirmId: rivalCandidates[2]?.id || 'firm_millwall_cross',
        venueName: `${newFirm.pubStronghold} Exterior`,
        location: `${newFirm.city} (${newFirm.region})`,
        footballFixture: `${newFirm.footballClub} vs ${rivalCandidates[2]?.footballClub || 'Millwall Cross'}`,
        clashPlayed: false,
        isDerby: true
      }
    ];
    setFixtures(updatedFixtures);
    setCurrentRound(1);
    setCityState(generateInitialCityState(newFirm.city, newFirm.footballClub, newFirm.clubBand === 'Elite' ? 85 : 70));
    showToast(`Switched active firm to ${newFirm.name} (${newFirm.footballClub})!`);
  };

  // Trigger SFS Phone Call Wire
  const handleTriggerPhoneCall = () => {
    sound.playWhistle();
    const topBoy = lads.find(l => l.role === 'top_boy') || lads[0];
    const situations = [
      `Guvnor, it's ${topBoy.name}. We've got 40 lads stationed outside the station tap. The away coach just pulled into the retail car park without a police escort. Do we take 'em now?`,
      `Terry here. British Transport Police are setting up Section 60 kettles at the station. Do we scatter down the canal towpath or push through their cordon to meet the rivals?`,
      `Boss, the face from our rival firm just rung. They want a clean 20-on-20 in the industrial estate out of sight of the coppers. Do we accept their terms?`
    ];
    const chosenSit = situations[Math.floor(Math.random() * situations.length)];
    setIncomingCall({
      callerName: topBoy.name,
      callerNickname: topBoy.nickname,
      situation: chosenSit
    });
  };

  // Clash Flow
  const handleStartClash = () => {
    if (!activeFixture || !rivalFirm) return;
    sound.playWhistle();
    setIsClashActive(true);
  };

  const handleCompleteClash = (outcome: ClashOutcome) => {
    setIsClashActive(false);
    setCurrentOutcome(outcome);

    // Apply outcome to state
    setRespect(prev => Math.max(50, prev + outcome.respectDelta));
    setLoyaltyIndex(prev => Math.max(10, Math.min(100, prev + outcome.loyaltyDelta)));
    setTreasury(prev => Math.max(0, prev + outcome.treasuryDelta));

    // Update Player Firm in league
    setFirms(prevFirms =>
      prevFirms.map(f => {
        if (f.id === playerFirm.id) {
          return {
            ...f,
            respect: Math.max(50, f.respect + outcome.respectDelta),
            loyaltyIndex: Math.max(10, Math.min(100, f.loyaltyIndex + outcome.loyaltyDelta))
          };
        }
        if (f.id === rivalFirmId) {
          return {
            ...f,
            respect: Math.max(50, f.respect - (outcome.respectDelta / 2))
          };
        }
        return f;
      })
    );

    // Handle injuries & arrests
    if (outcome.playerInjuries.length > 0) {
      setLads(prevLads =>
        prevLads.map(l => {
          if (outcome.playerInjuries.includes(l.name)) {
            return {
              ...l,
              status: 'injured',
              health: 30,
              matchesFought: l.matchesFought + 1
            };
          }
          if (tactics.selectedLadIds.includes(l.id)) {
            return {
              ...l,
              matchesFought: l.matchesFought + 1,
              victories: outcome.winnerId === playerFirm.id ? l.victories + 1 : l.victories
            };
          }
          return l;
        })
      );
    }

    if (outcome.arrests.length > 0) {
      setLads(prevLads =>
        prevLads.map(l => {
          if (outcome.arrests.includes(l.name)) {
            return {
              ...l,
              status: 'bailed',
              legalHeat: Math.min(100, l.legalHeat + 35)
            };
          }
          return l;
        })
      );
    }

    // Mark fixture completed
    setFixtures(prev =>
      prev.map(fix =>
        fix.id === activeFixture?.id ? { ...fix, clashPlayed: true, outcome } : fix
      )
    );

    // Add News Item
    const newArticle: TerraceNews = {
      id: `news_${Date.now()}`,
      headline: outcome.headline,
      snippet: outcome.newspaperQuote,
      source: 'The Sunday Sport Gazette',
      timeAgo: 'Just now',
      severity: outcome.winnerId === playerFirm.id ? 'low' : 'high'
    };
    setNews(prev => [newArticle, ...prev.slice(0, 8)]);
  };

  const handleReturnToOffice = () => {
    const outcome = currentOutcome;
    setCurrentOutcome(null);
    setCurrentRound(prev => prev + 1);
    setActiveTab('office');

    // Natural weekly territory + city venues income
    const weeklyTerritoryIncome = territories
      .filter(t => t.controlledBy === playerFirm.id)
      .reduce((sum, t) => sum + t.weeklyRevenue, 0);

    const cityVenueIncome = cityState.venues
      .filter(v => v.controlledByFirm && v.isUnlocked)
      .reduce((sum, v) => sum + v.weeklyRevenue, 0);

    setTreasury(prev => prev + weeklyTerritoryIncome + cityVenueIncome);

    // Police heat decay
    setPoliceHeat(prev => Math.max(15, prev - 8));

    // Dynamic SFS City Growth progression:
    // When the team plays matches or firm claims prestige, the city expands!
    setCityState(prev => {
      const victoryBonus = outcome?.winnerId === playerFirm.id ? 4 : 1;
      const newScore = Math.min(100, prev.prosperityScore + victoryBonus);
      let newTier = prev.prosperityTier;
      let newStage = prev.growthStage;
      if (newScore >= 90) { newTier = 5; newStage = 'Cosmopolitan Football Capital'; }
      else if (newScore >= 80) { newTier = 4; newStage = 'Prosperous Metro'; }
      else if (newScore >= 70) { newTier = 3; newStage = 'Booming Regional Centre'; }
      else if (newScore >= 55) { newTier = 2; newStage = 'Developing Industrial Hub'; }

      const updatedVenues = prev.venues.map(v => ({
        ...v,
        isUnlocked: v.minProsperityTier <= newTier
      }));

      const newDispatch = {
        id: `disp_${Date.now()}`,
        timestamp: `Round ${currentRound + 1}`,
        headline: `${prev.cityName} Economic Pulse Updates`,
        body: `${prev.clubName}'s recent matchday results drive local trade across the borough. Pavement commerce and terrace venues report brisk turnover.`,
        category: 'growth' as const
      };

      return {
        ...prev,
        prosperityScore: newScore,
        prosperityTier: newTier,
        growthStage: newStage,
        venues: updatedVenues,
        cityDispatches: [newDispatch, ...prev.cityDispatches.slice(0, 5)]
      };
    });
  };

  const handleExecuteVenueAction = (venueId: string, actionId: string, action: CityVenue['actions'][0]) => {
    if (treasury < action.cost) {
      showToast('Insufficient funds in firm treasury!');
      return;
    }
    sound.playPunch();
    setTreasury(prev => prev - action.cost + (action.cashDelta || 0));
    setRespect(prev => Math.max(50, prev + action.respectDelta));
    setLoyaltyIndex(prev => Math.max(10, Math.min(100, prev + action.loyaltyDelta)));
    setPoliceHeat(prev => Math.max(0, Math.min(100, prev + action.policeHeatDelta)));

    // Update venue control level
    setCityState(prev => ({
      ...prev,
      venues: prev.venues.map(v => {
        if (v.id === venueId) {
          const newControl = Math.min(100, v.firmControlLevel + 5);
          return {
            ...v,
            controlledByFirm: true,
            firmControlLevel: newControl,
            weeklyRevenue: v.weeklyRevenue + 15
          };
        }
        return v;
      })
    }));

    showToast(`Authorized: ${action.label}`);
  };

  const handleRecruitFromEstate = (role: 'runner' | 'minder' | 'nutter') => {
    const costMap = { runner: 80, minder: 110, nutter: 130 };
    const cost = costMap[role];
    if (treasury < cost) {
      showToast('Insufficient funds to recruit!');
      return;
    }
    sound.playRoar();
    setTreasury(prev => prev - cost);

    const firstNames = ['Dean', 'Liam', 'Gaz', 'Wayne', 'Craig', 'Baz', 'Darren', 'Kev', 'Lee'];
    const lastNames = ['Fletcher', 'Mulligan', 'Connelly', 'Dempsey', 'O’Shea', 'Rimmer', 'Cawley'];
    const nicknames = {
      runner: ['Whistler', 'Ghost', 'Sprinter', 'Pacesetter'],
      minder: ['The Anvil', 'Bouncer', 'Brick', 'Wall'],
      nutter: ['Psycho', 'Mad Dog', 'Sparks', 'Wildcard']
    };

    const chosenFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
    const chosenLast = lastNames[Math.floor(Math.random() * lastNames.length)];
    const chosenNick = nicknames[role][Math.floor(Math.random() * nicknames[role].length)];

    const newLad: Lad = {
      id: `lad_estate_${Date.now()}`,
      name: `${chosenFirst} ${chosenLast}`,
      nickname: chosenNick,
      role,
      hardness: role === 'minder' ? 84 : role === 'nutter' ? 86 : 68,
      bottle: role === 'nutter' ? 90 : 75,
      pace: role === 'runner' ? 92 : 65,
      streetSmarts: 80,
      loyalty: 85,
      stamina: 80,
      health: 100,
      maxHealth: 100,
      legalHeat: 15,
      status: 'active',
      trait: {
        name: 'Estate Bred',
        description: 'Tough street background from council high-rises; naturally fearless.',
        statBonus: { hardness: 3, streetSmarts: 4 }
      },
      matchesFought: 0,
      victories: 0,
      avatarSeed: `seed_${Date.now()}`
    };

    setLads(prev => [newLad, ...prev]);
    showToast(`Recruited ${newLad.name} "${newLad.nickname}" from the council estate!`);
  };

  const handleResetCampaign = () => {
    if (window.confirm('Reset Firm U lator campaign to initial SFS season state?')) {
      localStorage.removeItem(STORAGE_KEY);
      setCurrentRound(1);
      setTreasury(750);
      setPoliceHeat(35);
      setRespect(540);
      setLoyaltyIndex(88);
      setPlayerFirmId('firm_northwood');
      setLads(INITIAL_LADS);
      setTactics(DEFAULT_TACTICS);
      setAwayPlan(DEFAULT_AWAY_PLAN);
      setFixtures(INITIAL_FIXTURES);
      setTerritories(INITIAL_TERRITORIES);
      setNews(INITIAL_NEWS);
      setFirms(INITIAL_FIRMS);
      setActiveTab('office');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-400 selection:text-zinc-950">
      {/* 3-Zone Compliant Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        treasury={treasury}
        respect={respect}
        policeHeat={policeHeat}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onStartClash={handleStartClash}
        canClash={!!activeFixture && !isClashActive && !currentOutcome}
        clubName={playerFirm.footballClub}
        onOpenClubModal={() => setIsClubModalOpen(true)}
      />

      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 p-3 bg-amber-400 text-zinc-950 font-mono text-xs font-bold rounded-lg shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* SFS Phone Call Overlay */}
      {incomingCall && (
        <FirmPhoneCallOverlay
          callerName={incomingCall.callerName}
          callerNickname={incomingCall.callerNickname}
          clubName={playerFirm.footballClub}
          firmName={playerFirm.name}
          situation={incomingCall.situation}
          onAccept={(msg) => {
            setLoyaltyIndex(l => Math.min(100, l + 10));
            setRespect(r => r + 25);
            setIncomingCall(null);
            showToast(msg);
          }}
          onDecline={(msg) => {
            setPoliceHeat(h => Math.max(10, h - 15));
            setLoyaltyIndex(l => Math.max(10, l - 5));
            setIncomingCall(null);
            showToast(msg);
          }}
          onDismiss={() => setIncomingCall(null)}
        />
      )}

      {/* SFS 26 Clubs Selection Modal */}
      {isClubModalOpen && (
        <ClubSelectModal
          firms={firms}
          currentFirmId={playerFirm.id}
          onSelectFirm={handleSelectClub}
          onClose={() => setIsClubModalOpen(false)}
        />
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {currentOutcome ? (
          <PostClashReport
            outcome={currentOutcome}
            playerFirm={playerFirm}
            onReturnToOffice={handleReturnToOffice}
          />
        ) : isClashActive && activeFixture && rivalFirm ? (
          <ClashEngine
            playerFirm={playerFirm}
            rivalFirm={rivalFirm}
            fixture={activeFixture}
            tactics={tactics}
            awayPlan={awayPlan}
            lads={lads}
            onCompleteClash={handleCompleteClash}
            onCancel={() => setIsClashActive(false)}
          />
        ) : (
          <>
            {activeTab === 'office' && (
              <OfficeView
                playerFirm={playerFirm}
                nextFixture={activeFixture}
                rivalFirm={rivalFirm}
                lads={lads}
                news={news}
                loyaltyIndex={loyaltyIndex}
                policeHeat={policeHeat}
                treasury={treasury}
                setActiveTab={setActiveTab}
                onOpenClash={handleStartClash}
                onOpenClubModal={() => setIsClubModalOpen(true)}
                onTriggerPhoneCall={handleTriggerPhoneCall}
              />
            )}

            {activeTab === 'squad' && (
              <SquadView
                lads={lads}
                treasury={treasury}
                onUpdateLad={handleUpdateLad}
                onDeductTreasury={handleDeductTreasury}
              />
            )}

            {activeTab === 'tactics' && (
              <TacticsView
                tactics={tactics}
                lads={lads}
                onUpdateTactics={setTactics}
              />
            )}

            {activeTab === 'away_days' && (
              <AwayTravelPlanner
                plan={awayPlan}
                nextFixture={activeFixture}
                rivalFirm={rivalFirm}
                treasury={treasury}
                playerFirmId={playerFirm.id}
                onUpdatePlan={setAwayPlan}
              />
            )}

            {activeTab === 'city' && (
              <CityView
                cityState={cityState}
                treasury={treasury}
                policeHeat={policeHeat}
                respect={respect}
                loyaltyIndex={loyaltyIndex}
                onExecuteVenueAction={handleExecuteVenueAction}
                onRecruitFromEstate={handleRecruitFromEstate}
              />
            )}

            {activeTab === 'league' && (
              <LeagueView
                firms={firms}
                fixtures={fixtures}
                playerFirmId={playerFirm.id}
              />
            )}

            {activeTab === 'pub_hq' && (
              <PubHqView
                playerFirm={playerFirm}
                territories={territories}
                treasury={treasury}
                lads={lads}
                onUpgradeTerritory={handleUpgradeTerritory}
                onRecruitLad={handleRecruitLad}
                onPurchaseUpgrade={handlePurchaseUpgrade}
              />
            )}
          </>
        )}
      </main>

      {/* Quiet Footer with SFS mod indicator and reset option */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-4 px-6 text-xs font-mono text-zinc-500 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-zinc-400">Firm U lator</span>
          <span>·</span>
          <span>SFS v0.1 Official Hooligan Firm Mod (26 Clubs)</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsClubModalOpen(true)}
            className="hover:text-amber-400 transition-colors"
          >
            Change SFS Club ({playerFirm.footballClub})
          </button>
          <span>·</span>
          <button
            onClick={handleResetCampaign}
            className="text-zinc-600 hover:text-rose-400 transition-colors"
          >
            Reset Campaign Data
          </button>
        </div>
      </footer>
    </div>
  );
}
