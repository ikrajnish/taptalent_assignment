import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleUnit } from '../../features/settings/settingsSlice';
import type { RootState } from '../../store/store';

const UnitToggle: React.FC = () => {
    const unit = useSelector((state: RootState) => state.settings.unit);
    const dispatch = useDispatch();

    return (
        <button 
            onClick={() => dispatch(toggleUnit())}
            className="flex items-center justify-center bg-glass border border-glassBorder rounded-lg px-4 py-2 text-white font-bold hover:bg-slate-700 transition"
        >
            <span className={unit === 'metric' ? 'text-blue-400' : 'text-slate-400'}>°C</span>
            <span className="mx-2 text-slate-500">|</span>
            <span className={unit === 'imperial' ? 'text-blue-400' : 'text-slate-400'}>°F</span>
        </button>
    );
};

export default UnitToggle;
