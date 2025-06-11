npm install lucide-react
import React, { useState, useEffect } from 'react';
import { Users, Shield, Zap, Target, AlertTriangle, CheckCircle, BarChart3, Gamepad2, Trophy, Medal } from 'lucide-react';

const PrivacyTrailScorecard = () => {
  const [currentView, setCurrentView] = useState('game'); // 'game' or 'dashboard'
  const [teamName, setTeamName] = useState('');
  const [isTeamRegistered, setIsTeamRegistered] = useState(false);
  const [teams, setTeams] = useState([]); // Store all teams
  const [scores, setScores] = useState({
    trust: 10,
    compliance: 10,
    velocity: 10
  });

  const [roundChoices, setRoundChoices] = useState({
    1: { choice: '', trust: 0, compliance: 0, velocity: 0, notes: '' },
    2: { choice: '', trust: 0, compliance: 0, velocity: 0, notes: '' },
    3: { choice: '', trust: 0, compliance: 0, velocity: 0, notes: '' },
    4: { choice: '', trust: 0, compliance: 0, velocity: 0, notes: '' },
    5: { choice: '', trust: 0, compliance: 0, velocity: 0, notes: '' }
  });

  const scenarios = {
    1: {
      title: "The Great Data Grab",
      description: "Your team wants to collect as much user data as possible for future personalization",
      options: {
        A: { label: "Collect Everything", trust: -3, compliance: -3, velocity: +3 },
        B: { label: "Collect what you need", trust: +2, compliance: +3, velocity: -1 },
        C: { label: "Delay launch for data mapping", trust: +3, compliance: +3, velocity: -3 }
      }
    },
    2: {
      title: "River of Vendors",
      description: "Your analytics vendor was fined for shady practices. No DPA signed. Legal is OOO.",
      options: {
        A: { label: "Proceed", trust: -3, compliance: -5, velocity: +2 },
        B: { label: "Choose certified vendor", trust: +3, compliance: +4, velocity: -3 },
        C: { label: "Wait for legal", trust: -1, compliance: -2, velocity: 0 }
      }
    },
    3: {
      title: "UX Snakebite",
      description: "Marketing requests pop-up for birthday, zip code, shopping habits before user sees value",
      options: {
        A: { label: "Ship pop-up now", trust: -4, compliance: -3, velocity: +2 },
        B: { label: "Delay collection post-value", trust: +2, compliance: +2, velocity: -1 },
        C: { label: "Redesign UX with privacy principles", trust: +3, compliance: +3, velocity: -2 }
      }
    },
    4: {
      title: "Surveillance Storm",
      description: "Privacy orgs accuse your product of surveillance. A regulator tweets at you.",
      options: {
        A: { label: "Deny wrongdoing", trust: -5, compliance: -4, velocity: +2 },
        B: { label: "Apologize, tweak settings", trust: +1, compliance: +2, velocity: 0 },
        C: { label: "Full transparency + opt-outs", trust: +4, compliance: +4, velocity: -2 }
      }
    },
    5: {
      title: "Global Expansion Canyon",
      description: "Expanding to EU, LATAM, APAC with different privacy laws. No localized settings.",
      options: {
        A: { label: "Use U.S model globally", trust: -4, compliance: -5, velocity: +3 },
        B: { label: "Delay to localize", trust: +3, compliance: +5, velocity: -3 },
        C: { label: "Launch in low-regulation markets first", trust: -1, compliance: -2, velocity: +2 }
      }
    }
  };

  // Save team data whenever scores or choices change (only if team is registered)
  useEffect(() => {
    if (teamName && isTeamRegistered) {
      saveTeamData();
    }
    // eslint-disable-next-line
  }, [scores, roundChoices, teamName, isTeamRegistered]);

  const registerTeam = () => {
    const trimmedName = teamName.trim();
    if (!trimmedName) {
      alert('Please enter a team name');
      return;
    }

    const existingTeam = teams.find(team => team.name.toLowerCase() === trimmedName.toLowerCase());
    if (existingTeam) {
      const confirmOverwrite = window.confirm(
        `Team "${trimmedName}" already exists. Do you want to continue playing as this team?`
      );
      if (!confirmOverwrite) {
        return;
      }
      // Load existing team data
      setScores(existingTeam.scores);
      setRoundChoices(existingTeam.roundChoices);
    }

    setTeamName(trimmedName);
    setIsTeamRegistered(true);
  };

  const changeTeam = () => {
    setIsTeamRegistered(false);
    setTeamName('');
    setScores({ trust: 10, compliance: 10, velocity: 10 });
    setRoundChoices({
      1: { choice: '', trust: 0, compliance: 0, velocity: 0, notes: '' },
      2: { choice: '', trust: 0, compliance: 0, velocity: 0, notes: '' },
      3: { choice: '', trust: 0, compliance: 0, velocity: 0, notes: '' },
      4: { choice: '', trust: 0, compliance: 0, velocity: 0, notes: '' },
      5: { choice: '', trust: 0, compliance: 0, velocity: 0, notes: '' }
    });
  };

  const saveTeamData = () => {
    if (!teamName.trim()) return;

    const teamData = {
      name: teamName,
      scores: { ...scores },
      roundChoices: { ...roundChoices },
      lastUpdated: new Date().toISOString(),
      isGameOver: scores.trust <= 0 || scores.compliance <= 0 || scores.velocity <= 0,
      hasWon: scores.trust > 0 && scores.compliance > 0 && scores.velocity > 0 &&
        Object.values(roundChoices).every(round => round.choice !== ''),
      completedRounds: Object.values(roundChoices).filter(round => round.choice !== '').length
    };

    setTeams(prevTeams => {
      const existingIndex = prevTeams.findIndex(team => team.name === teamName);
      if (existingIndex >= 0) {
        const updated = [...prevTeams];
        updated[existingIndex] = teamData;
        return updated;
      } else {
        return [...prevTeams, teamData];
      }
    });
  };

  const handleChoiceChange = (round, choice) => {
    const scenario = scenarios[round];
    const option = scenario.options[choice];

    const newRoundChoices = {
      ...roundChoices,
      [round]: {
        choice,
        trust: option.trust,
        compliance: option.compliance,
        velocity: option.velocity,
        notes: roundChoices[round].notes
      }
    };

    setRoundChoices(newRoundChoices);

    // Recalculate total scores
    const newScores = { trust: 10, compliance: 10, velocity: 10 };
    Object.values(newRoundChoices).forEach(round => {
      newScores.trust += round.trust;
      newScores.compliance += round.compliance;
      newScores.velocity += round.velocity;
    });

    setScores(newScores);
  };

  const handleNotesChange = (round, notes) => {
    setRoundChoices({
      ...roundChoices,
      [round]: { ...roundChoices[round], notes }
    });
  };

  const resetGame = () => {
    setScores({ trust: 10, compliance: 10, velocity: 10 });
    setRoundChoices({
      1: { choice: '', trust: 0, compliance: 0, velocity: 0, notes: '' },
      2: { choice: '', trust: 0, compliance: 0, velocity: 0, notes: '' },
      3: { choice: '', trust: 0, compliance: 0, velocity: 0, notes: '' },
      4: { choice: '', trust: 0, compliance: 0, velocity: 0, notes: '' },
      5: { choice: '', trust: 0, compliance: 0, velocity: 0, notes: '' }
    });
  };

  const clearAllTeams = () => {
    setTeams([]);
  };

  const getScoreColor = (score) => {
    if (score <= 0) return 'text-red-600 font-bold';
    if (score <= 3) return 'text-orange-500 font-semibold';
    if (score <= 6) return 'text-yellow-500';
    return 'text-green-600';
  };

  const getScoreStatus = (score) => {
    if (score <= 0) return 'DEAD';
    if (score <= 3) return 'CRITICAL';
    if (score <= 6) return 'WARNING';
    return 'HEALTHY';
  };

  const isGameOver = scores.trust <= 0 || scores.compliance <= 0 || scores.velocity <= 0;
  const hasWon = scores.trust > 0 && scores.compliance > 0 && scores.velocity > 0 &&
    Object.values(roundChoices).every(round => round.choice !== '');

  // Sort teams for leaderboard
  const sortedTeams = [...teams].sort((a, b) => {
    // Winners first
    if (a.hasWon && !b.hasWon) return -1;
    if (!a.hasWon && b.hasWon) return 1;

    // Then by total score
    const aTotalScore = a.scores.trust + a.scores.compliance + a.scores.velocity;
    const bTotalScore = b.scores.trust + b.scores.compliance + b.scores.velocity;

    if (aTotalScore !== bTotalScore) return bTotalScore - aTotalScore;

    // Then by completed rounds
    return b.completedRounds - a.completedRounds;
  });

  const renderDashboard = () => (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <div style={{ background: "linear-gradient(90deg, #ede9fe, #dbeafe)", padding: 24, borderRadius: 16, border: "2px solid #c4b5fd" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ fontSize: 28, fontWeight: "bold", color: "#1e293b", display: "flex", alignItems: "center" }}>
            <BarChart3 style={{ width: 32, height: 32, marginRight: 12, color: "#8b5cf6" }} />
            Team Dashboard
          </h2>
          <div style={{ fontSize: 14, color: "#64748b" }}>
            {teams.length} team{teams.length !== 1 ? 's' : ''} registered
          </div>
        </div>

        {teams.length === 0 ? (
          <div style={{ textAlign: "center", padding: 32, color: "#64748b" }}>
            <Users style={{ width: 48, height: 48, margin: "0 auto 12px", opacity: 0.5 }} />
            <p>No teams have started playing yet!</p>
            <p style={{ fontSize: 14 }}>Switch to Game view to start playing.</p>
          </div>
        ) : (
          <>
            {/* Leaderboard */}
            <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001", marginBottom: 24, overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(90deg, #facc15, #fb923c)", padding: 16 }}>
                <h3 style={{ fontSize: 20, fontWeight: "bold", color: "#fff", display: "flex", alignItems: "center" }}>
                  <Trophy style={{ width: 24, height: 24, marginRight: 8 }} />
                  Leaderboard
                </h3>
              </div>
              <div>
                {sortedTeams.map((team, index) => (
                  <div key={team.name} style={{ padding: 16, borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ marginRight: 16 }}>
                        {index === 0 && team.hasWon && (
                          <Trophy style={{ width: 24, height: 24, color: "#facc15" }} />
                        )}
                        {index === 1 && (
                          <Medal style={{ width: 24, height: 24, color: "#9ca3af" }} />
                        )}
                        {index === 2 && (
                          <Medal style={{ width: 24, height: 24, color: "#ea580c" }} />
                        )}
                        {index > 2 && (
                          <span style={{ width: 24, height: 24, borderRadius: "50%", background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600 }}>
                            {index + 1}
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 style={{ fontWeight: "bold", fontSize: 18 }}>{team.name}</h4>
                        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 14 }}>
                          <span>Rounds: {team.completedRounds}/5</span>
                          {team.hasWon && (
                            <span style={{ background: "#dcfce7", color: "#166534", padding: "2px 8px", borderRadius: 6, fontWeight: 500 }}>
                              🎉 WINNER
                            </span>
                          )}
                          {team.isGameOver && !team.hasWon && (
                            <span style={{ background: "#fee2e2", color: "#991b1b", padding: "2px 8px", borderRadius: 6, fontWeight: 500 }}>
                              💀 GAME OVER
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 18, fontWeight: "bold" }}>
                        Total: {team.scores.trust + team.scores.compliance + team.scores.velocity}
                      </div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>
                        T:{team.scores.trust} C:{team.scores.compliance} V:{team.scores.velocity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* You can add more details for each team here if desired */}
          </>
        )}
      </div>
    </div>
  );

  // Main game UI
  const renderGame = () => (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 32, fontWeight: "bold", color: "#4f46e5", display: "flex", alignItems: "center" }}>
          <Gamepad2 style={{ width: 36, height: 36, marginRight: 10, color: "#4f46e5" }} />
          Privacy Trail Game
        </h1>
        <button
          onClick={() => setCurrentView(currentView === 'dashboard' ? 'game' : 'dashboard')}
          style={{
            background: "#a5b4fc",
            color: "#fff",
            padding: "8px 18px",
            borderRadius: 8,
            fontWeight: 600,
            border: "none",
            cursor: "pointer"
          }}
        >
          {currentView === 'dashboard' ? 'Back to Game' : 'Team Dashboard'}
        </button>
      </div>

      {!isTeamRegistered ? (
        <div style={{ background: "#f3f4f6", padding: 32, borderRadius: 16, textAlign: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: "bold", marginBottom: 12 }}>Register Your Team</h2>
          <input
            type="text"
            placeholder="Enter team name"
            value={teamName}
            onChange={e => setTeamName(e.target.value)}
            style={{
              padding: 12,
              borderRadius: 8,
              border: "1px solid #cbd5e1",
              marginRight: 12,
              fontSize: 16
            }}
          />
          <button
            onClick={registerTeam}
            style={{
              background: "#6366f1",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: 8,
              fontWeight: 600,
              border: "none",
              cursor: "pointer"
            }}
          >
            Register
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
            <h2 style={{ fontSize: 22, fontWeight: "bold", color: "#1e293b", marginRight: 16 }}>
              Team: {teamName}
            </h2>
            <button
              onClick={changeTeam}
              style={{
                background: "#fbbf24",
                color: "#fff",
                padding: "6px 14px",
                borderRadius: 8,
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                fontSize: 14
              }}
            >
              Change Team
            </button>
          </div>

          <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
            <div style={{ flex: 1, background: "#f1f5f9", borderRadius: 12, padding: 18, textAlign: "center" }}>
              <Shield style={{ width: 28, height: 28, color: "#2563eb", margin: "0 auto 4px" }} />
              <div style={{ fontSize: 16, fontWeight: 500, color: "#334155" }}>Trust</div>
              <div className={getScoreColor(scores.trust)} style={{ fontSize: 28, fontWeight: "bold" }}>{scores.trust}</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>{getScoreStatus(scores.trust)}</div>
            </div>
            <div style={{ flex: 1, background: "#f0fdf4", borderRadius: 12, padding: 18, textAlign: "center" }}>
              <CheckCircle style={{ width: 28, height: 28, color: "#22c55e", margin: "0 auto 4px" }} />
              <div style={{ fontSize: 16, fontWeight: 500, color: "#334155" }}>Compliance</div>
              <div className={getScoreColor(scores.compliance)} style={{ fontSize: 28, fontWeight: "bold" }}>{scores.compliance}</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>{getScoreStatus(scores.compliance)}</div>
            </div>
            <div style={{ flex: 1, background: "#fef9c3", borderRadius: 12, padding: 18, textAlign: "center" }}>
              <Zap style={{ width: 28, height: 28, color: "#eab308", margin: "0 auto 4px" }} />
              <div style={{ fontSize: 16, fontWeight: 500, color: "#334155" }}>Velocity</div>
              <div className={getScoreColor(scores.velocity)} style={{ fontSize: 28, fontWeight: "bold" }}>{scores.velocity}</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>{getScoreStatus(scores.velocity)}</div>
            </div>
          </div>

          {/* Game Over or Win */}
          {isGameOver && (
            <div style={{ background: "#fee2e2", color: "#991b1b", padding: 16, borderRadius: 10, marginBottom: 18, textAlign: "center" }}>
              <AlertTriangle style={{ width: 24, height: 24, marginBottom: 6, color: "#991b1b" }} />
              <div style={{ fontWeight: "bold", fontSize: 20 }}>GAME OVER</div>
              <div>Your team ran out of Trust, Compliance, or Velocity.</div>
              <button
                onClick={resetGame}
                style={{
                  background: "#f87171",
                  color: "#fff",
                  padding: "8px 16px",
                  borderRadius: 8,
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  marginTop: 10
                }}
              >
                Restart Game
              </button>
            </div>
          )}
          {hasWon && (
            <div style={{ background: "#dcfce7", color: "#166534", padding: 16, borderRadius: 10, marginBottom: 18, textAlign: "center" }}>
              <Trophy style={{ width: 24, height: 24, marginBottom: 6, color: "#166534" }} />
              <div style={{ fontWeight: "bold", fontSize: 20 }}>CONGRATULATIONS!</div>
              <div>Your team completed the Privacy Trail!</div>
              <button
                onClick={resetGame}
                style={{
                  background: "#22c55e",
                  color: "#fff",
                  padding: "8px 16px",
                  borderRadius: 8,
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  marginTop: 10
                }}
              >
                Play Again
              </button>
            </div>
          )}

          {/* Scenarios */}
          {!isGameOver && !hasWon && (
            <div>
              {[1, 2, 3, 4, 5].map(round => (
                <div key={round} style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001", marginBottom: 18, padding: 18 }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
                    <Target style={{ width: 22, height: 22, marginRight: 8, color: "#6366f1" }} />
                    <span style={{ fontWeight: "bold", fontSize: 16 }}>Round {round}: {scenarios[round].title}</span>
                  </div>
                  <div style={{ color: "#334155", marginBottom: 12 }}>{scenarios[round].description}</div>
                  <div style={{ display: "flex", gap: 16, marginBottom: 10 }}>
                    {Object.entries(scenarios[round].options).map(([optionKey, option]) => (
                      <label key={optionKey} style={{
                        flex: 1,
                        background: roundChoices[round].choice === optionKey ? "#a5b4fc" : "#f3f4f6",
                        color: roundChoices[round].choice === optionKey ? "#fff" : "#334155",
                        padding: 12,
                        borderRadius: 8,
                        fontWeight: 500,
                        cursor: "pointer",
                        display: "block"
                      }}>
                        <input
                          type="radio"
                          name={`round-${round}`}
                          value={optionKey}
                          checked={roundChoices[round].choice === optionKey}
                          onChange={() => handleChoiceChange(round, optionKey)}
                          style={{ marginRight: 8 }}
                          disabled={isGameOver || hasWon}
                        />
                        {optionKey}: {option.label}
                        <span style={{ fontSize: 12, marginLeft: 8 }}>
                          [T:{option.trust} C:{option.compliance} V:{option.velocity}]
                        </span>
                      </label>
                    ))}
                  </div>
                  <textarea
                    placeholder="Team notes (optional)"
                    value={roundChoices[round].notes}
                    onChange={e => handleNotesChange(round, e.target.value)}
                    style={{
                      width: "100%",
                      minHeight: 36,
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      padding: 8,
                      fontSize: 14
                    }}
                    disabled={isGameOver || hasWon}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <div>
      {currentView === 'dashboard' ? renderDashboard() : renderGame()}
      <div style={{ textAlign: "center", margin: "32px 0 0", color: "#64748b", fontSize: 14 }}>
        <button
          onClick={clearAllTeams}
          style={{
            background: "#f87171",
            color: "#fff",
            padding: "6px 16px",
            borderRadius: 8,
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
            marginTop: 24
          }}
        >
          Clear All Teams (reset leaderboard)
        </button>
      </div>
    </div>
  );
};

export default PrivacyTrailScorecard;
