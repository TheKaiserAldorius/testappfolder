import { useEffect } from "react";
import { Page } from "@/components/Page.tsx";
import { Button,  } from "@telegram-apps/telegram-ui";
import "./rouletteStyles.css";
import { ModalPrize } from "./ModalPrize";
import { initData, useSignal, useLaunchParams, miniApp, openPopup } from "@telegram-apps/sdk-react";
import Bear from "../../../../assets/prize/bear.webp";
import happyBirth from "../../../../assets/prize/happyBirth.webp";

// 🔥 Дополнительные иконки
import StarIcon from "../../../../assets/prize/StarsIcon.webp";
import CaseIcon from "../../../../assets/cases/bday_case.webp";

import { PossiblePrizes } from "./PossiblePrizes";

import { useUnifiedRoulette } from "@/hooks/useUnifiedRoulette";
import { generateRoulette, startRolling } from "./generateRoulette";


import { useLanguage } from "@/components/LanguageContext";

const items = {
  1: { id: "5170233102089322756", img: Bear, price: 15, chance: "50%"},
  12: { id: "5782984811920491178", img: happyBirth, price: 350, chance: "50%"},
};



export const BdayCase: React.FC = () => {
  const initDataState = useSignal(initData.state);
  const user = initDataState?.user;
  const { platform } = useLaunchParams(); // Получаем платформу
  const isDark = useSignal(miniApp.isDark);
  const {language} = useLanguage();

  useEffect(() => {
    // Применяем стили только для iOS
    if (platform === "ios") {
      const casePreviewCircle = document.querySelector(".case-preview-circle") as HTMLElement;
      const rouletteroller = document.querySelector(".raffle-roller") as HTMLElement;
      const rafflerollerholder = document.querySelector(".raffle-roller-holder") as HTMLElement;
      const caseCards = document.querySelectorAll(".raffle-roller-container .item");
      const container = document.querySelector(".possible-prizes-container") as HTMLElement | null;

      if (casePreviewCircle) {
        if (isDark) {
          casePreviewCircle.style.backgroundColor = "#232e3c"; // Тёмный фон для iOS
        } else {
          casePreviewCircle.style.backgroundColor = "#f1f1f1"; // Светлый фон для iOS
        }
      }

      if (rouletteroller) {
        if (isDark) {
          rouletteroller.style.backgroundColor = "#232e3c"; // Тёмный фон для iOS
        } else {
          rouletteroller.style.backgroundColor = "#fff"; // Светлый фон для iOS
        }
      }

      if (rafflerollerholder) {
        if (isDark) {
          rafflerollerholder.style.backgroundColor = "#232e3c"; // Тёмный фон для iOS
        } else {
          rafflerollerholder.style.backgroundColor = "#f1f1f1"; // Светлый фон для iOS
        }
      }
      if (!container) return;

      // Для iOS задаем стиль
      if (platform === "ios") {
        if (isDark) {
          container.style.backgroundColor = "#232e3c"; // Тёмный фон для iOS
        } else {
          container.style.backgroundColor = "#f1f1f1"; // Светлый фон для iOS
        }
      }
      caseCards.forEach((card) => {
        const htmlElement = card as HTMLElement;
        if (isDark) {
          htmlElement.style.backgroundColor = "#111921"; // Тёмный фон для iOS и темной темы
        } else {
          htmlElement.style.backgroundColor = "#fff"; // Светлый фон для iOS и светлой темы
        }
      });
    } else {
      // Если не iOS, применяем стили для всех остальных платформ
      const caseCards = document.querySelectorAll(".raffle-roller-container .item");

      caseCards.forEach((card) => {
        const htmlElement = card as HTMLElement;
        if (isDark) {
          htmlElement.style.backgroundColor = "#232e3c"; // Тёмный фон для остальных платформ и темной темы
        } else {
          htmlElement.style.backgroundColor = "#f1f1f1"; // Светлый фон для остальных платформ и светлой темы
        }
      });
    }
  }, [platform, isDark]); // Запускаем эффект при изменении платформы и темы
  
  const {
    winningItemId,
    gameStarted,
    isModalOpen,
    handleStart,
    handleCloseModal,
    handleSell,
    idGiftNumber,
  } = useUnifiedRoulette(
    'bday', // caseType
    175, // casePrice
    {
      generateRoulette,
      startRolling,
      items
    },
    user?.username
  );

  const winningItem = Object.values(items).find(item => item.id === winningItemId);
  console.log(`🎲 Выигранный ID: ${winningItemId}`);

  

  return (
    <Page back={true}>
      <div className="scroll-wrapper">
      {/* 🧊 Превью кейса */}
      <div className="case-preview-circle">
        <img src={CaseIcon} alt="case" />
      </div>
      <div className="roulette-section">
      {/* 🎰 Рулетка */}
      <div className="raffle-roller">
        <div className="raffle-roller-holder">
          <div className="bottom-triangle"></div>
          <div className="raffle-roller-container" id="roulette-container"></div>
        </div>
      </div>

      {/* 🔘 Кнопка запуска */}
      <div className="start-button"> 
        <Button
          onClick={async () => {
            // const isBlocked = await fetchCaseStatus(12); // 🔥 живая проверка

            // if (isBlocked) {
            //   await openPopup({
            //     title: language === 'ru' ? "Кейс заблокирован" : "Case Blocked",
            //     message: language === 'ru'
            //       ? "Этот кейс временно недоступен. Попробуйте позже."
            //       : "This case is temporarily unavailable. Try again later.",
            //     buttons: [{ id: "ok", type: "default", text: "OK" }],
            //   });
            //   return;
            // }

            handleStart();
          }}
          disabled={gameStarted}
        >
          {language === 'ru' ? "Испытай удачу - 175" : "Try Your Luck - 175"}
          <img src={StarIcon} alt="star" />
        </Button>
      </div>

      {/* 🎁 Возможные призы */}
      <PossiblePrizes items={items} />
      </div></div>
      {/* 🪄 Модалка с выигрышем */}
      {winningItem && idGiftNumber !== null && (
        <ModalPrize
          isOpen={isModalOpen}
          winningItem={winningItem}
          idGiftNumber={idGiftNumber}
          onClose={handleCloseModal}
          onSell={handleSell}
        />
      )}
    </Page>
  );
};
