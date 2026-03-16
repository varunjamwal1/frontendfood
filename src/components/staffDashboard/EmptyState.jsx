import React from 'react';

const EmptyState = ({ title, description, icon, actionText, onAction }) => {
  return (
    <div className="text-center py-24 px-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 max-w-2xl mx-auto">
      <div className="text-8xl mb-8 opacity-20">{icon}</div>
      <h3 className="text-4xl font-black text-white mb-4">{title}</h3>
      <p className="text-xl text-gray-400 mb-8 leading-relaxed">{description}</p>
      
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-12 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] text-lg"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;