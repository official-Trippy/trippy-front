import React, { useState } from 'react';

interface WeatherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (weather: string, temperature: string | null) => void;
}

const weatherOptions = [
  { value: 'sunny', label: '맑음' },
  { value: 'rain', label: '비' },
  { value: 'snow', label: '눈' },
  { value: 'mostly_cloudy', label: '구름많음' },
  { value: 'cloudy', label: '흐림' },
];

const WeatherModal: React.FC<WeatherModalProps> = ({ isOpen, onClose, onSave }) => {
  const [selectedWeather, setSelectedWeather] = useState<string>(weatherOptions[0].value);
  const [temperature, setTemperature] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(selectedWeather, temperature);
    onClose();
  };

  return (
    <div className="weather-modal-overlay">
      <div className="weather-modal-content">
        <div className='text-[16px] text-bold font-bold mb-[10px]'>날씨와 온도를 선택하세요</div>

        {/* 날씨 상태 및 온도 입력란을 세로로 배치 */}
        <div className="form-row">
          <label htmlFor="weather-select">날씨 상태:</label>
          <select
            id="weather-select"
            value={selectedWeather}
            onChange={(e) => setSelectedWeather(e.target.value)}
          >
            {weatherOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="temperature-input">온도 상태:</label>
          <div>
          <input
            id="temperature-input"
            type="number"
            value={temperature ?? ''}
            onChange={(e) => setTemperature(e.target.value)}
            placeholder=""
          />
          <span className='ml-[2px]'>°C</span>
        </div>
        </div>

        {/* 버튼을 하단에 배치 */}
        <div className="button-group">
          <button onClick={handleSave}>확인</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default WeatherModal;