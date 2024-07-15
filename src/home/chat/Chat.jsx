import { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import upload from "../../lib/upload";
import { format } from "timeago.js";

const Chat = () => {
  const [chat, setChat] = useState();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "",
  });

  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSend = async () => {
    if (text === "") return;

    let imgUrl = null;

    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });

      const userIDs = [currentUser.id, user.id];

      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );

          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (err) {
      console.log(err);
    } finally {
      setImg({
        file: null,
        url: "",
      });

      setText("");
    }
  };

  return (
    <div className="flex-2 border-l border-r border-gray-300 h-full flex flex-col">
      <div className="p-5 flex items-center justify-between border-b border-gray-300">
        <div className="flex items-center gap-5">
          <img
            src={user?.avatar || "./avatar.png"}
            alt=""
            className="w-15 h-15 rounded-full object-cover"
          />
          <div className="flex flex-col gap-1">
            <span className="text-lg font-bold">{user?.username}</span>
            <p className="text-sm font-light text-gray-500">
              Lorem ipsum dolor, sit amet.
            </p>
          </div>
        </div>
        <div className="flex gap-5">
          <img src="./phone.png" alt="" className="w-5 h-5" />
          <img src="./video.png" alt="" className="w-5 h-5" />
          <img src="./info.png" alt="" className="w-5 h-5" />
        </div>
      </div>
      <div className="p-5 flex-1 overflow-auto flex flex-col gap-5">
        {chat?.messages?.map((message) => (
          <div
            className={`max-w-[70%] flex gap-5 ${
              message.senderId === currentUser?.id ? "self-end" : ""
            }`}
            key={message?.createdAt}
          >
            <div className="flex flex-col gap-1">
              {message.img && (
                <img
                  src={message.img}
                  alt=""
                  className="w-full h-75 rounded-lg object-cover"
                />
              )}
              <p
                className={`p-5 rounded-lg ${
                  message.senderId === currentUser?.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                {message.text}
              </p>
              <span className="text-xs">
                {format(message.createdAt.toDate())}
              </span>
            </div>
          </div>
        ))}
        {img.url && (
          <div className="self-end max-w-[70%] flex gap-5">
            <div className="flex flex-col gap-1">
              <img src={img.url} alt="" className="w-full h-75 rounded-lg object-cover" />
            </div>
          </div>
        )}
        <div ref={endRef}></div>
      </div>
      <div className="p-5 flex items-center justify-between border-t border-gray-300 gap-5 mt-auto">
        <div className="flex gap-5">
          <label htmlFor="file">
            <img src="./img.png" alt="" className="w-5 h-5 cursor-pointer" />
          </label>
          <input
            type="file"
            id="file"
            className="hidden"
            onChange={handleImg}
          />
          <img src="./camera.png" alt="" className="w-5 h-5 cursor-pointer" />
          <img src="./mic.png" alt="" className="w-5 h-5 cursor-pointer" />
        </div>
        <input
          type="text"
          placeholder={
            isCurrentUserBlocked || isReceiverBlocked
              ? "You cannot send a message"
              : "Type a message..."
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
          className="flex-1 bg-gray-700 border-none outline-none text-white p-5 rounded-lg text-base disabled:cursor-not-allowed"
        />
        <div className="relative">
          <img
            src="./emoji.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
            className="w-5 h-5 cursor-pointer"
          />
          <div className="absolute bottom-12 left-0">
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button
          className="bg-blue-600 text-white py-2 px-4 rounded-lg cursor-pointer disabled:bg-blue-400 disabled:cursor-not-allowed"
          onClick={handleSend}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
