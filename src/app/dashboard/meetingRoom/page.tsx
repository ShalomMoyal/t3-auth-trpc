"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

interface RoomMeetingProps {
  roomID: string;
  userID: string;
  userName: string;
  appID: number;
  serverSecret: string;
}

const RoomMeeting: React.FC<RoomMeetingProps> = ({
  roomID,
  userID,
  userName,
  appID,
  serverSecret,
}) => {
  const meetingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMeeting = async () => {
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomID,
        userID,
        userName,
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);

      zp.joinRoom({
        container: meetingRef.current!,
        sharedLinks: [
          {
            name: "Personal link",
            url:
              window.location.origin +
              window.location.pathname +
              "?roomID=" +
              roomID,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall,
        },
        showTurnOffRemoteCameraButton: true,
        showTurnOffRemoteMicrophoneButton: true,
        showRemoveUserButton: true,
      });
    };

    initMeeting();
  }, [roomID, userID, userName, appID, serverSecret]);

  return (
    <div className="h-screen w-full">
      <div ref={meetingRef} className="h-full w-full" />
    </div>
  );
};

export default function RoomMeetingPage() {
  const searchParams = useSearchParams();
  const proposalID = searchParams.get("proposalID");
  const userID = searchParams.get("userID");

  const roomID = proposalID;
  const userName = "User" + userID;
  const appID = 1985400917; 
  const serverSecret = "298faf46bcfc0d6d883bb6ff1f7ae5f0";

  return (
    <div className="h-screen w-full bg-gray-100">
      <RoomMeeting
        roomID={roomID ?? ""}
        userID={userID ?? ""}
        userName={userName}
        appID={appID}
        serverSecret={serverSecret}
      />
    </div>
  );
}
