

// import Chat from "./Chat";

import Events from "@/views/events/components/event-public";

function Home() {

  return (
    <>

      {/* <Chat /> */}
      <div className="flex  h-[100%] bg-background text-foreground">
        {/* <Sidebar onSelectRoom={setSelectedRoom} selectedRoomId={selectedRoom} /> */}
        <main className="flex-1 flex flex-col overflow-hidden">
            <Events/>
        </main>
      </div>
    </>
  );
}

export default Home;
