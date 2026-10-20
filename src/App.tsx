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
  DEFAULT_AWAY_PLAN,
  generateSeasonFixtures
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
import { Venue, Territory as WarTerritory, TerritoryWarCampaign, DoorEvent, DoorChoice } from './types/territoryWars';
import {
  INITIAL_VENUES as INITIAL_WAR_VENUES,
  INITIAL_TERRITORIES as INITIAL_WAR_TERRITORIES,
  createDoorEventForVenue,
  createWarCampaign
} from './data/territoryWarsData';
import { DoorEventModal } from './components/DoorEventModal';
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

  // Nightlife Door Security & Territory Wars Subsystem
  const [warVenues, setWarVenues] = useState<Venue[]>(INITIAL_WAR_VENUES);
  const [warTerritories, setWarTerritories] = useState<WarTerritory[]>(INITIAL_WAR_TERRITORIES);
  const [activeCampaign, setActiveCampaign] = useState<TerritoryWarCampaign | null>(null);
  const [activeDoorEvent, setActiveDoorEvent] = useState<{ event: DoorEvent; venue: Venue } | null>(null);

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
        const targetPlayerFirmId = parsed.playerFirmId && INITIAL_FIRMS.some(f => f.id === parsed.playerFirmId)
          ? parsed.playerFirmId
          : 'firm_northwood';
        setPlayerFirmId(targetPlayerFirmId);
        setCurrentRound(Number(parsed.currentRound) || 1);
        setTreasury(parsed.treasury || 750);
        setPoliceHeat(parsed.policeHeat || 35);
        setRespect(parsed.respect || 540);
        setLoyaltyIndex(parsed.loyaltyIndex || 88);
        if (parsed.lads && parsed.lads.length > 0) setLads(parsed.lads);
        if (parsed.tactics) setTactics(parsed.tactics);
        if (parsed.awayTravelPlan) setAwayPlan(parsed.awayTravelPlan);

        // Sanity check fixtures: ensure player's firm has unplayed fixtures scheduled
        if (parsed.fixtures && parsed.fixtures.length > 0) {
          const unplayedForFirm = parsed.fixtures.filter(
            f => !f.clashPlayed && (f.homeFirmId === targetPlayerFirmId || f.awayFirmId === targetPlayerFirmId)
          );
          if (unplayedForFirm.length > 0) {
            setFixtures(parsed.fixtures);
          } else {
            // All fixtures for this firm were finished; generate fresh full season calendar
            setFixtures(generateSeasonFixtures(targetPlayerFirmId, INITIAL_FIRMS, 1));
            setCurrentRound(1);
          }
        } else {
          setFixtures(generateSeasonFixtures(targetPlayerFirmId, INITIAL_FIRMS, 1));
        }

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
  // Always find the next unplayed fixture involving the player firm!
  const activeFixture =
    fixtures.find(f => f.round === currentRound && !f.clashPlayed && (f.homeFirmId === playerFirm.id || f.awayFirmId === playerFirm.id)) ||
    fixtures.find(f => !f.clashPlayed && (f.homeFirmId === playerFirm.id || f.awayFirmId === playerFirm.id));
  const rivalFirmId = activeFixture
    ? activeFixture.homeFirmId === playerFirm.id
      ? activeFixture.awayFirmId
      : activeFixture.homeFirmId
    : undefined;
  const rivalFirm = firms.find(f => f.id === rivalFirmId) || (rivalFirmId ? firms.find(f => f.id !== playerFirm.id) : undefined);

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

    // Generate full authentic season calendar for newly chosen firm
    const updatedFixtures = generateSeasonFixtures(firmId, firms, 1);
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

    // Advance to the round of the next unplayed fixture involving the player's firm
    const nextUnplayed = fixtures.find(
      f => !f.clashPlayed && (f.homeFirmId === playerFirm.id || f.awayFirmId === playerFirm.id)
    );
    if (nextUnplayed) {
      setCurrentRound(nextUnplayed.round);
    } else {
      setCurrentRound(fixtures.length + 1);
    }

    setActiveTab('office');

    // Natural weekly territory + city venues income + nightlife door cuts minus minder wages
    const weeklyTerritoryIncome = territories
      .filter(t => t.controlledBy === playerFirm.id)
      .reduce((sum, t) => sum + t.weeklyRevenue, 0);

    const cityVenueIncome = cityState.venues
      .filter(v => v.controlledByFirm && v.isUnlocked)
      .reduce((sum, v) => sum + v.weeklyRevenue, 0);

    const doorGross = warVenues
      .filter(v => v.ownerFirmId === playerFirm.id)
      .reduce((sum, v) => sum + v.weeklyTake, 0);

    const mindersCount = warVenues
      .filter(v => v.ownerFirmId === playerFirm.id)
      .reduce((sum, v) => sum + v.doorStaffIds.length, 0);

    const minderWages = mindersCount * 150;
    const netDoorIncome = doorGross - minderWages;

    setTreasury(prev => Math.max(0, prev + weeklyTerritoryIncome + cityVenueIncome + netDoorIncome));

    // Police heat decay
    setPoliceHeat(prev => Math.max(15, prev - 8));

    // Weekly Door Event chance (35%) on controlled venues
    if (Math.random() < 0.35) {
      const controlled = warVenues.filter(v => v.ownerFirmId === playerFirm.id);
      if (controlled.length > 0) {
        const randomVenue = controlled[Math.floor(Math.random() * controlled.length)];
        const evt = createDoorEventForVenue(randomVenue);
        setTimeout(() => {
          setActiveDoorEvent({ event: evt, venue: randomVenue });
        }, 1200);
      }
    }

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

  // Door Security & Minders
  const handleAssignMinder = (venueId: string, ladId: string) => {
    setWarVenues(prev =>
      prev.map(v => {
        if (v.id === venueId && !v.doorStaffIds.includes(ladId)) {
          return { ...v, doorStaffIds: [...v.doorStaffIds, ladId] };
        }
        return v;
      })
    );
    showToast('Door minder assigned! (£150/wk wage)');
  };

  const handleRemoveMinder = (venueId: string, ladId: string) => {
    setWarVenues(prev =>
      prev.map(v => {
        if (v.id === venueId) {
          return { ...v, doorStaffIds: v.doorStaffIds.filter(id => id !== ladId) };
        }
        return v;
      })
    );
    showToast('Door minder relieved from duty.');
  };

  const handleTakeoverVenue = (venueId: string, method: 'hostile' | 'bribe' | 'intimidate') => {
    const venue = warVenues.find(v => v.id === venueId);
    if (!venue) return;

    if (method === 'bribe') {
      if (treasury < 450) {
        showToast('Insufficient funds! Need £450 to bribe licensee.');
        return;
      }
      setTreasury(t => t - 450);
      setWarVenues(prev =>
        prev.map(v => (v.id === venueId ? { ...v, ownerFirmId: playerFirm.id, status: 'controlled' } : v))
      );
      showToast(`Licensee bribed! ${venue.name} door secured.`);
    } else if (method === 'intimidate') {
      if (respect < 450) {
        showToast('Respect too low! Need 450+ respect to intimidate owner.');
        return;
      }
      setWarVenues(prev =>
        prev.map(v => (v.id === venueId ? { ...v, ownerFirmId: playerFirm.id, status: 'controlled' } : v))
      );
      setRespect(r => r + 20);
      showToast(`Owner intimidated by firm reputation! ${venue.name} surrendered.`);
    } else if (method === 'hostile') {
      sound.playWhistle();
      setWarVenues(prev =>
        prev.map(v => (v.id === venueId ? { ...v, ownerFirmId: playerFirm.id, status: 'controlled' } : v))
      );
      setRespect(r => r + 35);
      setPoliceHeat(h => Math.min(100, h + 20));
      showToast(`Hostile takeover successful! Door secured in violent street scrap.`);
    }
  };

  const handleTriggerDoorEvent = (venueId: string) => {
    const venue = warVenues.find(v => v.id === venueId);
    if (!venue) return;
    const evt = createDoorEventForVenue(venue);
    setActiveDoorEvent({ event: evt, venue });
  };

  const handleResolveDoorEventChoice = (choice: DoorChoice, choiceIndex: number) => {
    if (!activeDoorEvent) return;
    const { venue } = activeDoorEvent;

    setTreasury(t => Math.max(0, t + choice.treasuryDelta));
    setRespect(r => Math.max(50, r + choice.respectDelta));
    setPoliceHeat(h => Math.max(0, Math.min(100, h + choice.heatDelta)));

    if (choice.triggerClash) {
      sound.playWhistle();
      showToast(`BRAWL ON THE DOOR: Violent standoff erupted outside ${venue.name}!`);
    } else {
      showToast(`Resolved door incident at ${venue.name}: ${choice.label}`);
    }

    setActiveDoorEvent(null);
  };

  // Territory Wars Campaign
  const handleDeclareWar = (territoryId: string, targetFirmId: string, committedLadIds: string[]) => {
    const territory = warTerritories.find(t => t.id === territoryId);
    const targetFirm = firms.find(f => f.id === targetFirmId);
    if (!territory || !targetFirm) return;

    // Cost: 100 Police Heat
    setPoliceHeat(h => Math.min(100, h + 100));
    const campaign = createWarCampaign(territory, targetFirm.id, targetFirm.name, committedLadIds);
    setActiveCampaign(campaign);
    showToast(`WAR DECLARED: Police heat spiked to maximum across ${territory.name}!`);
  };

  const handleResolveDayBattle = (won: boolean, scoreSummary: string) => {
    if (!activeCampaign) return;

    const nextWins = won ? activeCampaign.wins + 1 : activeCampaign.wins;
    const nextLosses = !won ? activeCampaign.losses + 1 : activeCampaign.losses;
    const nextDay = activeCampaign.currentDay + 1;

    const updatedDays = activeCampaign.days.map(d => {
      if (d.day === activeCampaign.currentDay) {
        return { ...d, resolved: true, won, scoreSummary };
      }
      return d;
    });

    const isFinished = nextWins >= 2 || nextLosses >= 2 || nextDay > 3;

    if (isFinished) {
      const overallWon = nextWins > nextLosses;
      if (overallWon) {
        sound.playCheer();
        setRespect(r => r + 75);
        setLoyaltyIndex(l => Math.min(100, l + 15));
        setWarTerritories(prev =>
          prev.map(t => {
            if (t.id === activeCampaign.territoryId) {
              return {
                ...t,
                controllingFirmId: playerFirm.id,
                dominance: {
                  ...t.dominance,
                  [playerFirm.id]: Math.min(100, (t.dominance[playerFirm.id] || 40) + 35),
                  [activeCampaign.targetFirmId]: Math.max(5, (t.dominance[activeCampaign.targetFirmId] || 40) - 30)
                }
              };
            }
            return t;
          })
        );
        // Boost venues in that territory
        setWarVenues(prev =>
          prev.map(v => {
            if (v.territoryId === activeCampaign.territoryId) {
              return {
                ...v,
                ownerFirmId: playerFirm.id,
                status: 'controlled',
                weeklyTake: Math.floor(v.weeklyTake * 1.2)
              };
            }
            return v;
          })
        );
        showToast(`TERRITORY CONQUERED: Total dominance seized over ${activeCampaign.territoryName}!`);
      } else {
        sound.playHit();
        setRespect(r => Math.max(50, r - 40));
        setLoyaltyIndex(l => Math.max(10, l - 15));
        // Injure some committed lads
        setLads(prev =>
          prev.map(l => {
            if (activeCampaign.committedLadIds.includes(l.id) && Math.random() < 0.35) {
              return { ...l, status: 'injured', health: 30 };
            }
            return l;
          })
        );
        showToast(`CAMPAIGN DEFEAT: Rival firm held ${activeCampaign.territoryName}. Multiple lads injured.`);
      }

      setActiveCampaign({
        ...activeCampaign,
        wins: nextWins,
        losses: nextLosses,
        days: updatedDays,
        status: overallWon ? 'won' : 'lost'
      });
    } else {
      setActiveCampaign({
        ...activeCampaign,
        wins: nextWins,
        losses: nextLosses,
        currentDay: nextDay,
        days: updatedDays
      });
      showToast(`Day ${activeCampaign.currentDay} concluded: ${won ? 'Victory' : 'Defeat'}. Moving to Day ${nextDay}.`);
    }
  };

  const handleAbandonCampaign = () => {
    setActiveCampaign(null);
    setRespect(r => Math.max(50, r - 25));
    showToast('War campaign called off. Respect damaged (-25).');
  };

  const handleStartNextSeason = () => {
    const nextSeasonNum = Math.floor(fixtures.length / 10) + 1;
    const newFixtures = generateSeasonFixtures(playerFirm.id, firms, nextSeasonNum);
    setFixtures(newFixtures);
    setCurrentRound(1);
    setRespect(prev => prev + 50); // Season completion bonus
    setTreasury(prev => prev + 500); // Season dividend
    showToast(`NEW SEASON: Season ${nextSeasonNum} calendar generated! 10 new matchday clashes scheduled.`);
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

      {/* Nightlife Door Event Modal */}
      {activeDoorEvent && (
        <DoorEventModal
          event={activeDoorEvent.event}
          venue={activeDoorEvent.venue}
          assignedLads={lads.filter(l => activeDoorEvent.venue.doorStaffIds.includes(l.id))}
          treasury={treasury}
          onResolveChoice={handleResolveDoorEventChoice}
          onClose={() => setActiveDoorEvent(null)}
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
            treasury={treasury}
            onCompleteClash={handleCompleteClash}
            onCancel={() => setIsClashActive(false)}
            onPoliceRaid={(loss) => {
              setTreasury(t => Math.max(0, t - loss));
              showToast(`POLICE RAID: £${loss} treasury confiscated! Clash cancelled.`);
            }}
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
                onStartNextSeason={handleStartNextSeason}
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
                onDeductTreasury={handleDeductTreasury}
                onAddTreasury={(amt) => setTreasury(t => t + amt)}
              />
            )}

            {activeTab === 'city' && (
              <CityView
                cityState={cityState}
                treasury={treasury}
                policeHeat={policeHeat}
                respect={respect}
                loyaltyIndex={loyaltyIndex}
                venues={warVenues}
                territories={warTerritories}
                lads={lads}
                firms={firms}
                playerFirm={playerFirm}
                activeCampaign={activeCampaign}
                onExecuteVenueAction={handleExecuteVenueAction}
                onRecruitFromEstate={handleRecruitFromEstate}
                onAssignMinder={handleAssignMinder}
                onRemoveMinder={handleRemoveMinder}
                onTakeoverVenue={handleTakeoverVenue}
                onTriggerDoorEvent={handleTriggerDoorEvent}
                onDeclareWar={handleDeclareWar}
                onResolveDayBattle={handleResolveDayBattle}
                onAbandonCampaign={handleAbandonCampaign}
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
