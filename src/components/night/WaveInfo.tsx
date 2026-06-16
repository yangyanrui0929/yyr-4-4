import { useGameStore } from "@/store/useGameStore";
import { ENEMY_CONFIGS, HIGH_PROFIT_THRESHOLD } from "@/game/config";
import Card from "@/components/common/Card";
import { Play, Pause, Bookmark, Undo2, Sparkles } from "lucide-react";
import { useState } from "react";

export default function WaveInfo() {
  const {
    currentWave,
    totalWaves,
    waveInProgress,
    isPaused,
    enemies,
    gold,
    lives,
    startWave,
    nextWave,
    togglePause,
    getCurrentWaves,
    waveReward,
    revertTickets,
    revertNode,
    setRevertNode,
    useRevertTicket,
    shadowTrails,
    escapedCount,
  } = useGameStore();

  const [showRevertConfirm, setShowRevertConfirm] = useState(false);

  const waves = getCurrentWaves();
  const currentWaveData = waves[currentWave];
  const isLastWave = currentWave >= totalWaves - 1;
  const canStartNext = !waveInProgress && currentWave < totalWaves;
  const canSetNode = !waveInProgress && !revertNode;
  const canRevert = revertTickets > 0 && !!revertNode;

  const uniqueShadowTypes = new Set(shadowTrails.map((t) => t.type));

  const handleRevert = () => {
    if (!canRevert) return;
    const ok = useRevertTicket();
    if (ok) {
      setShowRevertConfirm(false);
    }
  };

  const handleSetNode = () => {
    setRevertNode();
  };

  return (
    <Card title="波次信息" icon="⚔️" className="h-full">
      <div className="mb-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="font-medium text-purple-800">回锅券</span>
          </div>
          <span className="font-display text-xl text-purple-700">
            🎟️ {revertTickets}
          </span>
        </div>
        <div className="text-xs text-purple-600 space-y-0.5">
          <div>• 高利润(≥{HIGH_PROFIT_THRESHOLD})或无漏怪可获得</div>
          <div>• 消耗1张可回退到回锅节点</div>
        </div>
      </div>

      {uniqueShadowTypes.size > 0 && (
        <div className="mb-3 p-2 bg-purple-50/60 rounded-lg border border-purple-100">
          <div className="text-xs font-medium text-purple-700 mb-1.5">
            👻 影子轨迹预警 (逃脱过的敌人会加速)
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[...uniqueShadowTypes].map((type) => {
              const cfg = ENEMY_CONFIGS[type];
              return (
                <div
                  key={type}
                  className="flex items-center gap-1 px-2 py-0.5 bg-white rounded text-xs shadow-sm border border-purple-200"
                >
                  <span className="text-base">{cfg.emoji}</span>
                  <span className="text-purple-600 font-bold">⚡加速</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">当前波次</span>
          <span className="font-display text-2xl text-kitchen-warm">
            {Math.min(currentWave + 1, totalWaves)} / {totalWaves}
          </span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-kitchen-warm to-red-500 transition-all duration-500"
            style={{
              width: `${totalWaves > 0 ? ((currentWave + (waveInProgress ? 1 : 0)) / totalWaves) * 100 : 0}%`,
            }}
          />
        </div>
      </div>

      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="font-medium text-blue-800 mb-2">
          {waveInProgress ? "🟢 进行中..." : canStartNext ? `⚔️ 第 ${currentWave + 1} 波` : "✅ 已完成"}
        </div>
        {currentWaveData && (
          <div className="flex flex-wrap gap-2">
            {currentWaveData.enemies.map((e, i) => {
              const cfg = ENEMY_CONFIGS[e.type];
              return (
                <div
                  key={i}
                  className="flex items-center gap-1 px-2 py-1 bg-white rounded text-xs shadow-sm"
                >
                  <span className="text-lg">{cfg.emoji}</span>
                  <span className="font-bold">x{e.count}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="p-2 bg-red-50 rounded-lg text-center">
          <div className="text-xs text-gray-500">场上敌人</div>
          <div className="font-bold text-xl text-red-600">{enemies.length}</div>
        </div>
        <div className="p-2 bg-yellow-50 rounded-lg text-center">
          <div className="text-xs text-gray-500">本波奖励</div>
          <div className="font-bold text-xl text-yellow-600">💰{waveReward}</div>
        </div>
      </div>

      {escapedCount > 0 && (
        <div className="mb-3 p-2 bg-orange-50 rounded-lg border border-orange-200 text-center">
          <span className="text-xs text-orange-700">
            💨 已逃脱: <b className="text-orange-800">{escapedCount}</b> 只 | 无漏怪奖励失效
          </span>
        </div>
      )}

      <div className="space-y-2">
        {canSetNode && (
          <button
            onClick={handleSetNode}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all bg-purple-100 hover:bg-purple-200 text-purple-700 border-2 border-dashed border-purple-300"
          >
            <Bookmark className="w-4 h-4" />
            📍 设置回锅节点 (第{currentWave + 1}波前)
          </button>
        )}

        {revertNode && (
          <div className="p-2.5 bg-purple-100 rounded-lg border border-purple-300">
            <div className="flex items-center justify-between text-sm">
              <span className="text-purple-700">
                <Bookmark className="w-3.5 h-3.5 inline mr-1" />
                节点: 第{revertNode.waveIndex + 1}波前
              </span>
              <span className="text-purple-500 text-xs">
                💰{revertNode.gold} ❤️{revertNode.lives} 🏰{revertNode.towers.length}塔
              </span>
            </div>
          </div>
        )}

        {canStartNext && (
          <button
            onClick={() => {
              if (!waveInProgress) {
                startWave();
              }
            }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-lg bg-gradient-to-r from-kitchen-chili to-red-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all animate-pulse-soft"
          >
            <Play className="w-5 h-5 fill-current" />
            开始第{currentWave + 1}波
          </button>
        )}

        {waveInProgress && (
          <>
            <button
              onClick={togglePause}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all ${
                isPaused
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-yellow-500 text-white hover:bg-yellow-600"
              }`}
            >
              {isPaused ? (
                <>
                  <Play className="w-5 h-5" />
                  继续
                </>
              ) : (
                <>
                  <Pause className="w-5 h-5" />
                  暂停
                </>
              )}
            </button>
            {canRevert && (
              <>
                {!showRevertConfirm ? (
                  <button
                    onClick={() => setShowRevertConfirm(true)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all bg-purple-500 hover:bg-purple-600 text-white"
                  >
                    <Undo2 className="w-5 h-5" />
                    ⏪ 局势崩盘？使用回锅券
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="p-3 bg-purple-50 rounded-lg border-2 border-purple-400">
                      <div className="text-sm font-medium text-purple-800 mb-1">
                        ⚠️ 确认回锅？
                      </div>
                      <div className="text-xs text-purple-600 space-y-0.5">
                        <div>消耗 1 张回锅券 (剩余: {revertTickets})</div>
                        <div>回退到第{revertNode!.waveIndex + 1}波前状态</div>
                        <div>金币: {revertNode!.gold} | 生命: {revertNode!.lives}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setShowRevertConfirm(false)}
                        className="py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium text-sm"
                      >
                        取消
                      </button>
                      <button
                        onClick={handleRevert}
                        className="py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm"
                      >
                        ✅ 确认回锅
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {isLastWave && !waveInProgress && currentWave >= totalWaves && (
          <div className="p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border border-green-300 text-center">
            <div className="text-2xl mb-1">🎉</div>
            <div className="font-bold text-green-700">所有波次完成！</div>
            <div className="text-sm text-green-600 mt-1">即将进入结算...</div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-1">
        <div>💰 当前金币: <span className="font-bold text-yellow-600">{gold}</span></div>
        <div>❤️ 当前生命: <span className="font-bold text-red-600">{lives}</span></div>
      </div>
    </Card>
  );
}
