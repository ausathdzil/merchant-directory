/** biome-ignore-all lint/style/noMagicNumbers: Motion values */
'use client';

import {
  BookOpenIcon,
  CameraIcon,
  CarIcon,
  CoffeeIcon,
  DumbbellIcon,
  FlowerIcon,
  Gamepad2Icon,
  GiftIcon,
  HeartIcon,
  HomeIcon,
  LaptopIcon,
  MusicIcon,
  PackageIcon,
  PaletteIcon,
  PhoneIcon,
  ScissorsIcon,
  ShirtIcon,
  ShoppingBagIcon,
  SparkleIcon,
  StoreIcon,
  TruckIcon,
  UtensilsIcon,
  WrenchIcon,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useIsMobile } from '@/hooks/use-mobile';

export function HeroDecorations() {
  const isMobile = useIsMobile();

  return isMobile ? (
    <div className="flex items-center gap-4">
      <motion.div
        animate={{
          opacity: 1,
          scale: [0.3, 1],
        }}
        initial={{ opacity: 0, scale: 0.3 }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
          delay: 0.2,
        }}
      >
        <StoreIcon className="float-down size-12 stroke-primary" />
      </motion.div>
      <motion.div
        animate={{
          opacity: 1,
          scale: [0.3, 1],
        }}
        initial={{ opacity: 0, scale: 0.3 }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
          delay: 0.2,
        }}
      >
        <ShoppingBagIcon className="float-down size-12 stroke-emerald-500" />
      </motion.div>
      <motion.div
        animate={{
          opacity: 1,
          scale: [0.3, 1],
        }}
        initial={{ opacity: 0, scale: 0.3 }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
          delay: 0.2,
        }}
      >
        <CoffeeIcon className="float-down size-12 stroke-yellow-500" />
      </motion.div>
      <motion.div
        animate={{
          opacity: 1,
          scale: [0.3, 1],
        }}
        initial={{ opacity: 0, scale: 0.3 }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
          delay: 0.2,
        }}
      >
        <UtensilsIcon className="float-down size-12 stroke-rose-500" />
      </motion.div>
    </div>
  ) : (
    <div className="pointer-events-none absolute inset-0 mx-auto mt-16 hidden max-w-4/5 md:block">
      <motion.div
        animate={{
          opacity: 1,
          scale: [0.3, 1],
        }}
        className="float-up absolute top-[12%] left-[8%]"
        initial={{ opacity: 0, scale: 0.3 }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
          delay: 0.2,
        }}
      >
        <StoreIcon className="size-16 stroke-primary opacity-20" />
      </motion.div>

      <motion.div
        animate={{
          opacity: 1,
          scale: [0.3, 1],
        }}
        className="float-down absolute top-[8%] right-[8%]"
        initial={{ opacity: 0, scale: 0.3 }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
          delay: 0.4,
        }}
      >
        <ShoppingBagIcon className="size-14 stroke-emerald-500 opacity-20" />
      </motion.div>

      <motion.div
        animate={{
          opacity: 1,
          scale: [0.3, 1],
        }}
        className="float-rotate-up absolute top-[20%] left-[15%]"
        initial={{ opacity: 0, scale: 0.3 }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
          delay: 0.6,
        }}
      >
        <CoffeeIcon className="size-12 stroke-yellow-500 opacity-20" />
      </motion.div>

      <motion.div
        animate={{
          opacity: 1,
          scale: [0.3, 1],
        }}
        className="float-down absolute top-[18%] right-[15%]"
        initial={{ opacity: 0, scale: 0.3 }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
          delay: 0.8,
        }}
      >
        <UtensilsIcon className="size-14 stroke-blue-500 opacity-20" />
      </motion.div>

      <motion.div
        animate={{
          opacity: 1,
          scale: [0.3, 1],
        }}
        className="float-scale absolute top-[15%] left-[35%]"
        initial={{ opacity: 0, scale: 0.3 }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
          delay: 1.0,
        }}
      >
        <SparkleIcon className="size-12 stroke-purple-500 opacity-20" />
      </motion.div>

      <motion.div
        animate={{
          opacity: 1,
          scale: [0.3, 1],
        }}
        className="float-down absolute top-[25%] right-[35%]"
        initial={{ opacity: 0, scale: 0.3 }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
          delay: 1.2,
        }}
      >
        <HeartIcon className="size-14 stroke-red-500 opacity-20" />
      </motion.div>

      <motion.div
        animate={{
          opacity: 1,
          scale: [0.3, 1],
        }}
        className="float-rotate-down absolute top-[30%] left-[45%]"
        initial={{ opacity: 0, scale: 0.3 }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
          delay: 1.4,
        }}
      >
        <GiftIcon className="size-12 stroke-green-500 opacity-20" />
      </motion.div>

      <motion.div
        animate={{
          opacity: 1,
          scale: [0.3, 1],
        }}
        className="float-down absolute top-[12%] right-[45%]"
        initial={{ opacity: 0, scale: 0.3 }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
          delay: 1.6,
        }}
      >
        <ShirtIcon className="size-14 stroke-pink-500 opacity-20" />
      </motion.div>

      <motion.div
        animate={{
          opacity: 1,
          scale: [0.3, 1],
        }}
        className="float-up absolute top-[35%] left-[12%]"
        initial={{ opacity: 0, scale: 0.3 }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
          delay: 1.8,
        }}
      >
        <ScissorsIcon className="size-12 stroke-orange-500 opacity-20" />
      </motion.div>

      <motion.div
        animate={{
          opacity: 1,
          scale: [0.3, 1],
        }}
        className="float-scale-down absolute top-[40%] right-[12%]"
        initial={{ opacity: 0, scale: 0.3 }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
          delay: 2.0,
        }}
      >
        <PaletteIcon className="size-12 stroke-pink-500 opacity-20" />
      </motion.div>

      <motion.div
        animate={{
          opacity: 1,
          scale: [0.3, 1],
        }}
        className="float-up absolute top-[45%] left-[25%]"
        initial={{ opacity: 0, scale: 0.3 }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
          delay: 2.2,
        }}
      >
        <PackageIcon className="size-14 stroke-primary opacity-20" />
      </motion.div>

      <motion.div
        animate={{
          opacity: 1,
          scale: [0.3, 1],
        }}
        className="float-rotate-scale absolute top-[50%] left-[8%]"
        initial={{ opacity: 0, scale: 0.3 }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
          delay: 2.4,
        }}
      >
        <TruckIcon className="size-14 stroke-red-500 opacity-20" />
      </motion.div>

      <motion.div
        animate={{
          opacity: 1,
          scale: [0.3, 1],
        }}
        className="float-up absolute top-[8%] left-[5%]"
        initial={{ opacity: 0, scale: 0.3 }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
          delay: 0.9,
        }}
      >
        <CarIcon className="size-12 stroke-blue-600 opacity-20" />
      </motion.div>

      <motion.div
        animate={{
          opacity: 1,
          scale: [0.3, 1],
        }}
        className="float-down absolute top-[5%] right-[5%]"
        initial={{ opacity: 0, scale: 0.3 }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
          delay: 1.3,
        }}
      >
        <HomeIcon className="size-12 stroke-green-600 opacity-20" />
      </motion.div>

      <motion.div
        animate={{
          opacity: 1,
          scale: [0.3, 1],
        }}
        className="float-rotate-up absolute top-[55%] left-[35%]"
        initial={{ opacity: 0, scale: 0.3 }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
          delay: 2.1,
        }}
      >
        <BookOpenIcon className="size-10 stroke-indigo-500 opacity-20" />
      </motion.div>

      <motion.div
        animate={{
          opacity: 1,
          scale: [0.3, 1],
        }}
        className="float-down absolute top-[60%] right-[35%]"
        initial={{ opacity: 0, scale: 0.3 }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
          delay: 0.6,
        }}
      >
        <CameraIcon className="size-10 stroke-purple-600 opacity-20" />
      </motion.div>

      <motion.div
        animate={{
          opacity: 1,
          scale: [0.3, 1],
        }}
        className="float-up absolute top-[65%] right-[5%]"
        initial={{ opacity: 0, scale: 0.3 }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
          delay: 1.7,
        }}
      >
        <MusicIcon className="size-10 stroke-pink-600 opacity-20" />
      </motion.div>

      <motion.div
        animate={{
          opacity: 1,
          scale: [0.3, 1],
        }}
        className="float-rotate-scale absolute top-[70%] left-[5%]"
        initial={{ opacity: 0, scale: 0.3 }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
          delay: 2.8,
        }}
      >
        <Gamepad2Icon className="size-10 stroke-orange-600 opacity-20" />
      </motion.div>

      <motion.div
        animate={{
          opacity: 1,
          scale: [0.3, 1],
        }}
        className="float-up absolute top-[75%] left-[15%]"
        initial={{ opacity: 0, scale: 0.3 }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
          delay: 0.4,
        }}
      >
        <DumbbellIcon className="size-10 stroke-red-600 opacity-20" />
      </motion.div>

      <motion.div
        animate={{
          opacity: 1,
          scale: [0.3, 1],
        }}
        className="float-rotate-down absolute top-[80%] right-[15%]"
        initial={{ opacity: 0, scale: 0.3 }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
          delay: 1.9,
        }}
      >
        <FlowerIcon className="size-10 stroke-green-500 opacity-20" />
      </motion.div>

      <motion.div
        animate={{
          opacity: 1,
          scale: [0.3, 1],
        }}
        className="float-up absolute top-[85%] left-[5%]"
        initial={{ opacity: 0, scale: 0.3 }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
          delay: 2.3,
        }}
      >
        <WrenchIcon className="size-10 stroke-gray-600 opacity-20" />
      </motion.div>

      <motion.div
        animate={{
          opacity: 1,
          scale: [0.3, 1],
        }}
        className="float-down absolute top-[90%] right-[5%]"
        initial={{ opacity: 0, scale: 0.3 }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
          delay: 1.1,
        }}
      >
        <PhoneIcon className="size-10 stroke-blue-500 opacity-20" />
      </motion.div>

      <motion.div
        animate={{
          opacity: 1,
          scale: [0.3, 1],
        }}
        className="float-rotate-up absolute top-[95%] left-[15%]"
        initial={{ opacity: 0, scale: 0.3 }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
          delay: 0.8,
        }}
      >
        <LaptopIcon className="size-10 stroke-slate-600 opacity-20" />
      </motion.div>
    </div>
  );
}
