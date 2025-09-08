import { useState, useRef, useEffect, useCallback } from "react";
import type { ImageData } from "../types";

interface ImageCarouselProps {
    images: ImageData[];
    onImageClick?: (index: number) => void;
    aspectRatio?: string;
    showLabels?: boolean;
    showCounter?: boolean;
    autoPlayInterval?: number;
    lazyLoad?: boolean;
}

export default function ImageCarousel({
    images,
    // onImageClick,
    aspectRatio = "aspect-[3/2]",
    showLabels = true,
    showCounter = true,
    autoPlayInterval = 4000,
    lazyLoad = true
}: ImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedItemIndex, setSelectedItemIndex] = useState(0);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [modalAutoPlay, setModalAutoPlay] = useState(true);
    const [isUserInteracting, setIsUserInteracting] = useState(false);
    const [modalUserInteracting, setModalUserInteracting] = useState(false);
    const [imageLoadErrors, setImageLoadErrors] = useState<Set<string>>(new Set());
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [modalTouchStartX, setModalTouchStartX] = useState<number | null>(null);

    // Programmatic-scroll guards
    const isProgrammaticScroll = useRef(false);
    const modalIsProgrammaticScroll = useRef(false);

    const scrollRef = useRef<HTMLDivElement>(null);
    const modalScrollRef = useRef<HTMLDivElement>(null);
    const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const modalAutoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const interactionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const modalInteractionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Handle image load errors
    const handleImageError = useCallback((imageUrl: string) => {
        setImageLoadErrors(prev => new Set(prev).add(imageUrl));
    }, []);

    // Clear intervals function
    const clearAutoPlayIntervals = useCallback(() => {
        if (autoPlayRef.current) {
            clearInterval(autoPlayRef.current);
            autoPlayRef.current = null;
        }
        if (modalAutoPlayRef.current) {
            clearInterval(modalAutoPlayRef.current);
            modalAutoPlayRef.current = null;
        }
    }, []);

    // Clear timeout functions
    const clearInteractionTimeouts = useCallback(() => {
        if (interactionTimeoutRef.current) {
            clearTimeout(interactionTimeoutRef.current);
            interactionTimeoutRef.current = null;
        }
        if (modalInteractionTimeoutRef.current) {
            clearTimeout(modalInteractionTimeoutRef.current);
            modalInteractionTimeoutRef.current = null;
        }
    }, []);

    // Auto-play functionality for main carousel
    useEffect(() => {
        if (autoPlayRef.current) {
            clearInterval(autoPlayRef.current);
            autoPlayRef.current = null;
        }

        if (isAutoPlaying && !showModal && !isUserInteracting && images.length > 1) {
            autoPlayRef.current = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % images.length);
            }, autoPlayInterval);
        }

        return () => {
            if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current);
                autoPlayRef.current = null;
            }
        };
    }, [images.length, isAutoPlaying, showModal, isUserInteracting, autoPlayInterval]);

    // Auto-play functionality for modal carousel
    useEffect(() => {
        if (modalAutoPlayRef.current) {
            clearInterval(modalAutoPlayRef.current);
            modalAutoPlayRef.current = null;
        }

        if (modalAutoPlay && showModal && !modalUserInteracting) {
            const currentGallery = images[selectedItemIndex]?.gallery || [];
            if (currentGallery.length > 1) {
                modalAutoPlayRef.current = setInterval(() => {
                    setSelectedImageIndex((prev) => (prev + 1) % currentGallery.length);
                }, autoPlayInterval);
            }
        }

        return () => {
            if (modalAutoPlayRef.current) {
                clearInterval(modalAutoPlayRef.current);
                modalAutoPlayRef.current = null;
            }
        };
    }, [modalAutoPlay, showModal, selectedItemIndex, images, modalUserInteracting, autoPlayInterval]);

    // Smooth scroll to current item (main)
    useEffect(() => {
        if (scrollRef.current) {
            const container = scrollRef.current;
            const itemWidth = container.clientWidth;
            const targetScrollLeft = currentIndex * itemWidth;

            isProgrammaticScroll.current = true; // mark as programmatic
            container.scrollTo({ left: targetScrollLeft, behavior: "smooth" });

            // reset after animation (~500ms)
            const t = setTimeout(() => {
                isProgrammaticScroll.current = false;
            }, 500);

            return () => clearTimeout(t);
        }
    }, [currentIndex]);

    // Modal image scroll - ensure starts at the correct image and guard programmatic scroll
    useEffect(() => {
        if (modalScrollRef.current && showModal) {
            const container = modalScrollRef.current;
            const itemWidth = container.clientWidth;
            const targetScrollLeft = selectedImageIndex * itemWidth;
            const behavior: ScrollBehavior = selectedImageIndex === 0 ? "auto" : "smooth";

            modalIsProgrammaticScroll.current = true;
            container.scrollTo({ left: targetScrollLeft, behavior });

            const resetAfter = behavior === "smooth" ? 520 : 40;
            const t = setTimeout(() => {
                modalIsProgrammaticScroll.current = false;
            }, resetAfter);

            return () => clearTimeout(t);
        }
    }, [selectedImageIndex, showModal]);

    const handleMainScroll = useCallback(() => {
        if (!scrollRef.current || isProgrammaticScroll.current) return;

        const scrollLeft = scrollRef.current.scrollLeft;
        const width = scrollRef.current.clientWidth;
        const newIndex = Math.round(scrollLeft / width);

        if (newIndex !== currentIndex && newIndex >= 0 && newIndex < images.length) {
            setCurrentIndex(newIndex);
        }
    }, [currentIndex, images.length]);

    const handleModalScroll = useCallback(() => {
        // ignore programmatic scrolls
        if (!modalScrollRef.current || modalIsProgrammaticScroll.current || modalUserInteracting) return;

        const scrollLeft = modalScrollRef.current.scrollLeft;
        const width = modalScrollRef.current.clientWidth;
        const newIndex = Math.round(scrollLeft / width);
        const currentGallery = images[selectedItemIndex]?.gallery || [];

        if (newIndex !== selectedImageIndex && newIndex >= 0 && newIndex < currentGallery.length) {
            setSelectedImageIndex(newIndex);
        }
    }, [selectedImageIndex, selectedItemIndex, images, modalUserInteracting]);

    const goToSlide = useCallback((index: number) => {
        if (index >= 0 && index < images.length) {
            setCurrentIndex(index);
            setIsAutoPlaying(false);
            setIsUserInteracting(true);

            // Clear previous timeout
            if (interactionTimeoutRef.current) {
                clearTimeout(interactionTimeoutRef.current);
            }

            // Resume auto-play after delay
            interactionTimeoutRef.current = setTimeout(() => {
                setIsUserInteracting(false);
                setIsAutoPlaying(true);
            }, 2000);
        }
    }, [images.length]);

    const goToModalSlide = useCallback((index: number) => {
        const currentGallery = images[selectedItemIndex]?.gallery || [];
        if (index >= 0 && index < currentGallery.length) {
            setSelectedImageIndex(index);
            setModalAutoPlay(false);
            setModalUserInteracting(true);

            // Clear previous timeout
            if (modalInteractionTimeoutRef.current) {
                clearTimeout(modalInteractionTimeoutRef.current);
            }

            // Resume auto-play after delay
            modalInteractionTimeoutRef.current = setTimeout(() => {
                setModalUserInteracting(false);
                setModalAutoPlay(true);
            }, 2000);
        }
    }, [selectedItemIndex, images]);

    const navigateMainCarousel = useCallback((direction: "prev" | "next") => {
        const newIndex = direction === "prev"
            ? (currentIndex > 0 ? currentIndex - 1 : images.length - 1)
            : (currentIndex < images.length - 1 ? currentIndex + 1 : 0);
        goToSlide(newIndex);
    }, [currentIndex, images.length, goToSlide]);

    const navigateModalImages = useCallback((direction: "prev" | "next") => {
        const currentGallery = images[selectedItemIndex]?.gallery || [];
        const newIndex = direction === "prev"
            ? (selectedImageIndex > 0 ? selectedImageIndex - 1 : currentGallery.length - 1)
            : (selectedImageIndex < currentGallery.length - 1 ? selectedImageIndex + 1 : 0);
        goToModalSlide(newIndex);
    }, [selectedImageIndex, selectedItemIndex, images, goToModalSlide]);

    const handleImageClick = useCallback((index: number) => {
        setSelectedItemIndex(index);
        setSelectedImageIndex(0); // Always start at first image
        setShowModal(true);
        setIsAutoPlaying(false);
        setModalAutoPlay(true);
        setModalUserInteracting(false);
    }, []);

    const closeModal = useCallback(() => {
        setShowModal(false);
        setIsAutoPlaying(true);
        setModalAutoPlay(false);
        setModalUserInteracting(false);
        clearAutoPlayIntervals();
        clearInteractionTimeouts();
    }, [clearAutoPlayIntervals, clearInteractionTimeouts]);

    // Outside click to close modal
    const handleBackdropClick = useCallback((e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    }, [closeModal]);

    // Touch handling for main carousel
    const handleMainTouchStart = useCallback((e: React.TouchEvent) => {
        setTouchStartX(e.touches[0].clientX);
        setIsAutoPlaying(false);
        setIsUserInteracting(true);

        if (interactionTimeoutRef.current) {
            clearTimeout(interactionTimeoutRef.current);
        }
    }, []);

    const handleMainTouchMove = useCallback((e: React.TouchEvent) => {
        if (touchStartX === null) return;

        const touchEndX = e.touches[0].clientX;
        const diff = touchStartX - touchEndX;

        // Prevent default if significant horizontal swipe to avoid multi-scroll
        if (Math.abs(diff) > 20) {
            e.preventDefault();
        }
    }, [touchStartX]);

    const handleMainTouchEnd = useCallback((e: React.TouchEvent) => {
        if (touchStartX === null) return;

        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        const threshold = 50; // Minimum swipe distance

        // Only navigate if swipe is significant
        if (Math.abs(diff) > threshold) {
            if (diff > 0 && currentIndex < images.length - 1) {
                // Swipe left - next image
                goToSlide(currentIndex + 1);
            } else if (diff < 0 && currentIndex > 0) {
                // Swipe right - previous image  
                goToSlide(currentIndex - 1);
            } else if (diff > 0 && currentIndex === images.length - 1) {
                // Loop to first
                goToSlide(0);
            } else if (diff < 0 && currentIndex === 0) {
                // Loop to last
                goToSlide(images.length - 1);
            }
        }

        setTouchStartX(null);

        // Resume auto-play after delay
        interactionTimeoutRef.current = setTimeout(() => {
            setIsUserInteracting(false);
            setIsAutoPlaying(true);
        }, 2000);
    }, [touchStartX, currentIndex, images.length, goToSlide]);

    // Touch handling for modal carousel
    const handleModalTouchStart = useCallback((e: React.TouchEvent) => {
        setModalTouchStartX(e.touches[0].clientX);
        setModalAutoPlay(false);
        setModalUserInteracting(true);

        if (modalInteractionTimeoutRef.current) {
            clearTimeout(modalInteractionTimeoutRef.current);
        }
    }, []);

    const handleModalTouchMove = useCallback((e: React.TouchEvent) => {
        if (modalTouchStartX === null) return;

        const touchEndX = e.touches[0].clientX;
        const diff = modalTouchStartX - touchEndX;

        // Prevent default if significant horizontal swipe to avoid multi-scroll
        if (Math.abs(diff) > 20) {
            e.preventDefault();
        }
    }, [modalTouchStartX]);

    const handleModalTouchEnd = useCallback((e: React.TouchEvent) => {
        if (modalTouchStartX === null) return;

        const touchEndX = e.changedTouches[0].clientX;
        const diff = modalTouchStartX - touchEndX;
        const threshold = 50; // Minimum swipe distance
        const currentGallery = images[selectedItemIndex]?.gallery || [];

        // Only navigate if swipe is significant
        if (Math.abs(diff) > threshold) {
            if (diff > 0 && selectedImageIndex < currentGallery.length - 1) {
                // Swipe left - next image
                goToModalSlide(selectedImageIndex + 1);
            } else if (diff < 0 && selectedImageIndex > 0) {
                // Swipe right - previous image  
                goToModalSlide(selectedImageIndex - 1);
            } else if (diff > 0 && selectedImageIndex === currentGallery.length - 1) {
                // Loop to first
                goToModalSlide(0);
            } else if (diff < 0 && selectedImageIndex === 0) {
                // Loop to last
                goToModalSlide(currentGallery.length - 1);
            }
        }

        setModalTouchStartX(null);

        // Resume auto-play after delay
        modalInteractionTimeoutRef.current = setTimeout(() => {
            setModalUserInteracting(false);
            setModalAutoPlay(true);
        }, 2000);
    }, [modalTouchStartX, selectedImageIndex, selectedItemIndex, images, goToModalSlide]);

    // Keyboard navigation for accessibility
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!showModal) return;

            if (e.key === "Escape") {
                closeModal();
            } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                navigateModalImages("prev");
            } else if (e.key === "ArrowRight") {
                e.preventDefault();
                navigateModalImages("next");
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [showModal, closeModal, navigateModalImages]);

    // Prevent scroll on body when modal is open
    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [showModal]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            clearAutoPlayIntervals();
            clearInteractionTimeouts();
        };
    }, [clearAutoPlayIntervals, clearInteractionTimeouts]);

    const currentModalItem = images[selectedItemIndex];
    const currentGallery = currentModalItem?.gallery || [];
    const currentImage = currentGallery[selectedImageIndex];

    // Format "Don't Miss" into bulleted list with graceful fallbacks
    const formatDontMiss = useCallback((text: string) => {
        if (!text) return [];
        if (text.includes(",") || text.includes(";") || text.includes(" and ")) {
            const items = text.split(/[,;]|(?:\s+and\s+)/).map(item => item.trim()).filter(item => item);
            return items;
        }
        return [text];
    }, []);

    // Render placeholder for missing images
    const renderImagePlaceholder = useCallback((className: string) => (
        <div className={`${className} bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center`}>
            <i className="ri-image-line text-gray-400 text-2xl" />
        </div>
    ), []);

    // Graceful fallback for missing data
    const safeText = useCallback((text: string | undefined, fallback: string = "") => text || fallback, []);

    if (!images || images.length === 0) {
        return (
            <div className={`relative w-full ${aspectRatio} bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden rounded-2xl flex items-center justify-center`}>
                <div className="text-center">
                    <i className="ri-image-line text-gray-400 text-3xl mb-2" />
                    <p className="text-gray-500 text-sm">No images available</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Level 1 - Primary Image Carousel */}
            <div className={`relative w-full ${aspectRatio} bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden rounded-2xl`}>
                {/* Navigation Arrows - Only show if more than 1 image */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={() => navigateMainCarousel("prev")}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all cursor-pointer"
                            aria-label="Previous image"
                        >
                            <i className="ri-arrow-left-line text-lg" />
                        </button>

                        <button
                            onClick={() => navigateMainCarousel("next")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all cursor-pointer"
                            aria-label="Next image"
                        >
                            <i className="ri-arrow-right-line text-lg" />
                        </button>
                    </>
                )}

                {/* Images Container */}
                <div
                    ref={scrollRef}
                    className="flex w-full h-full overflow-x-auto scrollbar-hide snap-x snap-mandatory"
                    onScroll={handleMainScroll}
                    onTouchStart={handleMainTouchStart}
                    onTouchMove={handleMainTouchMove}
                    onTouchEnd={handleMainTouchEnd}
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {images.map((image, index) => (
                        <div key={`main-${index}`} className="flex-shrink-0 w-full h-full snap-center relative">
                            {imageLoadErrors.has(image.url) ? (
                                renderImagePlaceholder("w-full h-full")
                            ) : (
                                <img
                                    src={image.url}
                                    alt=""
                                    className="w-full h-full object-cover transition-opacity duration-500 cursor-pointer"
                                    onClick={() => handleImageClick(index)}
                                    loading={lazyLoad && index === 0 ? "eager" : "lazy"}
                                    draggable={false}
                                    onError={() => handleImageError(image.url)}
                                />
                            )}

                            {/* Image Label */}
                            {showLabels && image.label && (
                                <div
                                    className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-medium border border-white/20 cursor-pointer hover:bg-black/80 transition-all max-w-[calc(100%-2rem)]"
                                    onClick={() => handleImageClick(index)}
                                >
                                    <span className="truncate">{image.label}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Navigation Dots - Only show if more than 1 image */}
                {images.length > 1 && (
                    <div className="absolute bottom-4 right-4 flex gap-1">
                        {images.map((_, index) => (
                            <button
                                key={`dot-${index}`}
                                onClick={() => goToSlide(index)}
                                className={`transition-all duration-300 cursor-pointer ${index === currentIndex
                                    ? "w-6 h-2 bg-white rounded-full"
                                    : "w-2 h-2 bg-white/60 rounded-full hover:bg-white/80"
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}

                {/* Image Counter */}
                {showCounter && images.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium border border-white/20">
                        {currentIndex + 1}/{images.length}
                    </div>
                )}
            </div>

            {/*  Level 2 - Modal Carousel */}
            {showModal && currentModalItem && (
                <div
                    className="fixed inset-0 z-50 flex items-end"
                    onClick={handleBackdropClick}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/50" />

                    {/* Modal Container - Scrollable */}
                    <div
                        ref={modalRef}
                        className="relative w-full bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* Modal Carousel */}
                        <div className="w-full bg-white">
                            <div className="relative w-full h-80">
                                {/* Close Button Overlay */}
                                <button
                                    onClick={closeModal}
                                    className="absolute top-4 right-4 z-30 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-all cursor-pointer"
                                    aria-label="Close modal"
                                >
                                    <i className="ri-close-line text-lg" />
                                </button>

                                {/* Gallery Navigation Arrows - Only show if more than 1 image */}
                                {currentGallery.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => navigateModalImages("prev")}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all cursor-pointer"
                                            aria-label="Previous gallery image"
                                        >
                                            <i className="ri-arrow-left-line text-lg" />
                                        </button>

                                        <button
                                            onClick={() => navigateModalImages("next")}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all cursor-pointer"
                                            aria-label="Next gallery image"
                                        >
                                            <i className="ri-arrow-right-line text-lg" />
                                        </button>
                                    </>
                                )}

                                {/* Gallery Images Container */}
                                <div
                                    ref={modalScrollRef}
                                    className="flex w-full h-full overflow-x-auto scrollbar-hide snap-x snap-mandatory"
                                    onScroll={handleModalScroll}
                                    onTouchStart={handleModalTouchStart}
                                    onTouchMove={handleModalTouchMove}
                                    onTouchEnd={handleModalTouchEnd}
                                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                                >
                                    {currentGallery.length > 0 ? currentGallery.map((galleryImage, idx) => (
                                        <div key={`gallery-${idx}`} className="flex-shrink-0 w-full h-full snap-center relative">
                                            {imageLoadErrors.has(galleryImage.url) ? (
                                                renderImagePlaceholder("w-full h-full")
                                            ) : (
                                                <img
                                                    src={galleryImage.url}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                    draggable={false}
                                                    loading={lazyLoad ? "lazy" : "eager"}
                                                    onError={() => handleImageError(galleryImage.url)}
                                                />
                                            )}

                                            {/* Image Label on Gallery Images */}
                                            {galleryImage.label && (
                                                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium border border-white/20 max-w-[calc(100%-2rem)]">
                                                    <span className="truncate">{galleryImage.label}</span>
                                                </div>
                                            )}
                                        </div>
                                    )) : (
                                        <div className="flex-shrink-0 w-full h-full snap-center relative">
                                            {renderImagePlaceholder("w-full h-full")}
                                        </div>
                                    )}
                                </div>

                                {/* Gallery Counter */}
                                {currentGallery.length > 1 && (
                                    <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium border border-white/20">
                                        {selectedImageIndex + 1}/{currentGallery.length}
                                    </div>
                                )}

                                {/* Gallery Dots */}
                                {currentGallery.length > 1 && (
                                    <div className="absolute bottom-4 right-4 flex gap-1">
                                        {currentGallery.map((_, idx) => (
                                            <button
                                                key={`gallery-dot-${idx}`}
                                                onClick={() => goToModalSlide(idx)}
                                                className={`transition-all duration-300 cursor-pointer ${idx === selectedImageIndex
                                                    ? "w-6 h-2 bg-white rounded-full"
                                                    : "w-2 h-2 bg-white/60 rounded-full hover:bg-white/80"
                                                    }`}
                                                aria-label={`Go to gallery image ${idx + 1}`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Scrollable Content Area */}
                        <div className="p-6 space-y-6">
                            {/* Title Section */}
                            <div>
                                <h2 id="modal-title" className="text-2xl font-bold text-gray-900 mb-2 break-words">
                                    {safeText(currentModalItem.label, "Untitled Location")}
                                </h2>
                                {currentModalItem.category && (
                                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                                        {currentModalItem.category}
                                    </span>
                                )}
                            </div>

                            {/* Quick Info Grid */}
                            {(currentModalItem.duration || currentModalItem.entryType || currentModalItem.timings || currentModalItem.entryFee) && (
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h3 className="font-semibold text-gray-900 mb-4 text-sm">Essential Information</h3>
                                    <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                                        {currentModalItem.duration && (
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <i className="ri-time-line text-blue-600 text-sm" />
                                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Duration</span>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-900 break-words">{currentModalItem.duration}</span>
                                            </div>
                                        )}

                                        {currentModalItem.entryType && (
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <i className="ri-door-open-line text-green-600 text-sm" />
                                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Entry</span>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-900 break-words">{currentModalItem.entryType}</span>
                                            </div>
                                        )}

                                        {currentModalItem.timings && (
                                            <div className="col-span-2">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <i className="ri-calendar-line text-orange-600 text-sm" />
                                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Timings</span>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-900 break-words">{currentModalItem.timings}</span>
                                            </div>
                                        )}

                                        {currentModalItem.entryFee && (
                                            <div className="col-span-2">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <i className="ri-money-rupee-circle-line text-purple-600 text-sm" />
                                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Entry Fee</span>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-900 break-words">{currentModalItem.entryFee}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Current Image Details */}
                            {currentImage && (
                                <div className="space-y-4">
                                    {currentImage.significance && (
                                        <div className="bg-blue-50 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <i className="ri-information-line text-blue-600" />
                                                <h4 className="font-semibold text-blue-900 text-sm">Significance</h4>
                                            </div>
                                            <p className="text-sm text-blue-800 leading-relaxed break-words">{currentImage.significance}</p>
                                        </div>
                                    )}

                                    {currentImage.description && (
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <i className="ri-file-text-line text-gray-600" />
                                                <h4 className="font-semibold text-gray-900 text-sm">Description</h4>
                                            </div>
                                            <p className="text-sm text-gray-700 leading-relaxed break-words">{currentImage.description}</p>
                                        </div>
                                    )}

                                    {currentImage.dontMiss && (
                                        <div className="bg-orange-50 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <i className="ri-star-line text-orange-600" />
                                                <h4 className="font-semibold text-orange-900 text-sm">Don't Miss</h4>
                                            </div>
                                            <ul className="space-y-2">
                                                {formatDontMiss(currentImage.dontMiss).map((item, idx) => (
                                                    <li key={idx} className="flex items-start gap-2 text-sm text-orange-800">
                                                        <i className="ri-checkbox-circle-fill text-orange-600 text-xs mt-1 flex-shrink-0" />
                                                        <span className="leading-relaxed break-words">{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}