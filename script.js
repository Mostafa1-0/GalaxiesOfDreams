document.addEventListener('DOMContentLoaded', function() {
    // Initialize OpenSeadragon viewer
    // Replace 'your-deep-zoom-image-path.dzi' with the actual path to your DZI image.
    // You'll need to generate a DZI image from a high-resolution space image.
    if (OpenSeadragon) {
        var viewer = OpenSeadragon({
            id: "openseadragon-viewer",
            prefixUrl: "https://cdnjs.cloudflare.com/ajax/libs/openseadragon/4.1.0/images/", // Path to OSD images (navigator, zoom-in, etc.)
            tileSources: {
                Image: {
                    xmlns: "http://schemas.microsoft.com/deepzoom/2008",
                    Url: "https://openseadragon.github.io/example-images/duomo/duomo_files/", // Example DZI tiles path
                    Format: "jpg",
                    Overlap: "2",
                    TileSize: "256",
                    Size: {
                        Width: "13920",
                        Height: "10200"
                    }
                }
            },
            showNavigator: true,      // Show a mini-map
            navigatorSizeRatio: 0.2,  // Size of the mini-map
            navigatorPosition: "BOTTOM_RIGHT", // Position of the mini-map
            viewportMargins: {
                top: 20,
                bottom: 20,
                left: 20,
                right: 20
            },
            // Customizing the UI controls for a space theme
            // These would typically be custom icons
            zoomInButton: "zoom-in-button",    // If you have custom buttons
            zoomOutButton: "zoom-out-button",
            homeButton: "home-button",
            fullPageButton: "full-page-button",
            nextButton: "next-button",
            previousButton: "previous-button",
            // For a more minimal UI, you might hide default controls
            showZoomControl: true,
            showHomeControl: true,
            showFullPageControl: true,
            // To hide all standard controls:
            // showNavigator: false,
            // showZoomControl: false,
            // showHomeControl: false,
            // showFullPageControl: false
        });

        // Optional: Add some custom CSS for the OSD controls if needed
        // For example, to style the default controls if you don't use custom images
        // You might want to override OSD's default button styles in your style.css
    } else {
        console.error("OpenSeadragon not loaded.");
    }
});