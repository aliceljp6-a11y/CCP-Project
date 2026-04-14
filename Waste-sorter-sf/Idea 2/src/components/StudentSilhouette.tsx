import React from 'react'

/** Height in px representing ~4.5 ft (scale reference for the pit). */
export const STUDENT_HEIGHT_PX = 120

export function StudentSilhouette() {
  return (
    <div className="pointer-events-none flex flex-col items-center">
      <img
        src="/4th-grader.png"
        alt="4th grader scale reference"
        width={180}
        height={300}
        className="drop-shadow-md"
        style={{ objectFit: 'contain' }}
      />
      <p className="mt-1 text-center font-display text-[0.9rem] font-semibold text-stone-700">
        4th Grader · ~4.5 ft
      </p>
    </div>
  )
}
