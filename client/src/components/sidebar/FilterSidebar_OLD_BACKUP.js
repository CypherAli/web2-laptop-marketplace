import React, { useState } from 'react';
import { 
    FiFilter, 
    FiSearch, 
    FiX,
    FiChevronDown,
    FiCheck
} from 'react-icons/fi';
import { 
    MdBrandingWatermark, 
    MdMemory, 
    MdComputer, 
    MdMoney, 
    MdSort, 
    MdHome,
    MdCheckBox
} from 'react-icons/md';
import { 
    SiAcer,
    SiLenovo,
    SiHp,
    SiAsus,
    SiDell,
    SiApple
} from 'react-icons/si';
import './FilterSidebar.css';

const FilterSidebar = ({
    tempFilters,
    handleTempFilterChange,
    toggleArrayFilter,
    handleApplyFilters,
    handleClearFilters,
    handleKeyPress,
    brands,
    ramOptions,
    processorOptions,
    activeFiltersCount
}) => {
    // State quản lý sections
    const [expandedSections, setExpandedSections] = React.useState({
        brand: true,
        ram: true,
        processor: true,
        price: true,
        sort: true
    });

    // Brand icons mapping với product count
    const brandData = {
        'Acer': { icon: <SiAcer />, count: 5 },
        'Lenovo': { icon: <SiLenovo />, count: 10 },
        'HP': { icon: <SiHp />, count: 151 },
        'HP Dsus': { icon: <SiHp />, count: 10 },
        'Asus': { icon: <SiAsus />, count: 7 },
        'Dell': { icon: <SiDell />, count: 3 },
        'Apple': { icon: <SiApple />, count: 8 },
    };

    // RAM values cho slider
    const ramValues = ['4GB', '8GB', '16GB', '32GB', '34GB', '64GB'];
    const cpuValues = ['Intel Core i5', 'Intel Core i7', 'AMD Ryzen 7', 'AMD Ryzen 9'];

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Get RAM index từ filter value
    const getRamIndex = () => {
        if (!tempFilters.rams || tempFilters.rams.length === 0) return 2; // Default 16GB
        const firstRam = tempFilters.rams[0];
        const index = ramValues.indexOf(firstRam);
        return index >= 0 ? index : 2;
    };

    // Get CPU index từ filter value
    const getCpuIndex = () => {
        if (!tempFilters.processors || tempFilters.processors.length === 0) return 1; // Default Core i7
        const firstCpu = tempFilters.processors[0];
        const index = cpuValues.indexOf(firstCpu);
        return index >= 0 ? index : 1;
    };

    // Handle RAM slider change
    const handleRamSliderChange = (e) => {
        const index = parseInt(e.target.value);
        const ramValue = ramValues[index];
        handleTempFilterChange('rams', [ramValue]);
    };

    // Handle CPU slider change
    const handleCpuSliderChange = (e) => {
        const index = parseInt(e.target.value);
        const cpuValue = cpuValues[index];
        handleTempFilterChange('processors', [cpuValue]);
    };

    return (
        <aside className="sidebar">
            <div className="filter-section-new">
                {/* Header */}
                <div className="filter-header-new">
                    <h3>
                        <FiSearch className="header-icon" />
                        TÌM KIẾM & LỌC
                    </h3>
                    {activeFiltersCount > 0 && (
                        <span className="active-filters-badge-new">
                            {activeFiltersCount}
                        </span>
                    )}
                </div>
                
                {/* Search Bar */}
                <div className="filter-group-new">
                    <div className="search-box-new">
                        <FiSearch className="search-icon" />
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm laptop..."
                            value={tempFilters.search}
                            onChange={(e) => handleTempFilterChange('search', e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="search-input-new"
                        />
                        {tempFilters.search && (
                            <button 
                                className="clear-btn"
                                onClick={() => handleTempFilterChange('search', '')}
                            >
                                <FiX />
                            </button>
                        )}
                    </div>
                </div>

                {/* Brand Filter - Horizontal Scroll */}
                <div className="filter-group-new">
                    <div 
                        className="filter-group-header-new"
                        onClick={() => toggleSection('brand')}
                    >
                        <div className="header-left">
                            <MdBrandingWatermark className="section-icon" />
                            <span>THƯƠNG HIỆU</span>
                        </div>
                        <FiChevronDown className={`chevron-icon ${expandedSections.brand ? 'expanded' : ''}`} />
                    </div>
                    {expandedSections.brand && (
                        <div className="filter-brand-scroll-container">
                            <div className="filter-brand-list">
                                {brands.map(brand => {
                                    const data = brandData[brand] || { icon: <MdBrandingWatermark />, count: 0 };
                                    const isSelected = tempFilters.brands.includes(brand);
                                    return (
                                        <div 
                                            key={brand} 
                                            className={`brand-card ${isSelected ? 'selected' : ''}`}
                                            onClick={() => toggleArrayFilter('brands', brand)}
                                        >
                                            <div className="brand-icon-wrapper">
                                                {data.icon}
                                            </div>
                                            <div className="brand-info">
                                                <span className="brand-name">{brand}</span>
                                                <span className="brand-count">{data.count}</span>
                                            </div>
                                            {isSelected && (
                                                <div className="check-badge-new">
                                                    <FiCheck />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* RAM Filter - Slider */}
                <div className="filter-group-new">
                    <div 
                        className={`filter-group-header ${!expandedSections.brand ? 'collapsed' : ''}`}
                        onClick={() => toggleSection('brand')}
                    >
                        <label>
                            <MdBrandingWatermark /> THƯƠNG HIỆU
                            {tempFilters.brands.length > 0 && (
                                <span className="selected-count">{tempFilters.brands.length}</span>
                            )}
                        </label>
                        <FiChevronDown className={`expand-icon ${expandedSections.brand ? 'expanded' : ''}`} />
                    </div>
                    {expandedSections.brand && (
                        <div className="checkbox-group-wrapper">
                            <div className="brand-chips-grid">
                                {getDisplayedItems(brands, 'brand').map(brand => (
                                    <div 
                                        key={brand} 
                                        className={`brand-chip ${tempFilters.brands.includes(brand) ? 'selected' : ''}`}
                                        onClick={() => toggleArrayFilter('brands', brand)}
                                    >
                                        <span className="brand-icon">{brandIcons[brand] || <MdBrandingWatermark />}</span>
                                        <span className="brand-name">{brand}</span>
                                        {tempFilters.brands.includes(brand) && <span className="check-badge">✓</span>}
                                    </div>
                                ))}
                            </div>
                            {brands.length > INITIAL_DISPLAY_LIMIT && (
                                <button 
                                    className="show-more-btn"
                                    onClick={() => toggleShowMore('brand')}
                                >
                                    {showMore.brand ? 'Thu gọn ↑' : `Xem thêm ${brands.length - INITIAL_DISPLAY_LIMIT} mục ↓`}
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* RAM Filter - Collapsible */}
                <div className="filter-group">
                    <div 
                        className={`filter-group-header ${!expandedSections.ram ? 'collapsed' : ''}`}
                        onClick={() => toggleSection('ram')}
                    >
                        <label>
                            <MdMemory /> RAM
                            {tempFilters.rams.length > 0 && (
                                <span className="selected-count">{tempFilters.rams.length}</span>
                            )}
                        </label>
                        <FiChevronDown className={`expand-icon ${expandedSections.ram ? 'expanded' : ''}`} />
                    </div>
                    {expandedSections.ram && (
                        <div className="checkbox-group-wrapper">
                            <div className="ram-options-grid">
                                {getDisplayedItems(ramOptions, 'ram').map(ram => (
                                    <div 
                                        key={ram} 
                                        className={`ram-option ${tempFilters.rams.includes(ram) ? 'selected' : ''}`}
                                        onClick={() => toggleArrayFilter('rams', ram)}
                                    >
                                        {ram}
                                    </div>
                                ))}
                            </div>
                            {ramOptions.length > INITIAL_DISPLAY_LIMIT && (
                                <button 
                                    className="show-more-btn"
                                    onClick={() => toggleShowMore('ram')}
                                >
                                    {showMore.ram ? 'Thu gọn ↑' : `Xem thêm ${ramOptions.length - INITIAL_DISPLAY_LIMIT} mục ↓`}
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Processor Filter - With Slider Design */}
                <div className="filter-group">
                    <div 
                        className={`filter-group-header ${!expandedSections.processor ? 'collapsed' : ''}`}
                        onClick={() => toggleSection('processor')}
                    >
                        <label>
                            <MdComputer /> CPU
                            {tempFilters.processors.length > 0 && (
                                <span className="selected-count">{tempFilters.processors.length}</span>
                            )}
                        </label>
                        <FiChevronDown className={`expand-icon ${expandedSections.processor ? 'expanded' : ''}`} />
                    </div>
                    {expandedSections.processor && (
                        <div className="checkbox-group-wrapper">
                            <div className="cpu-slider-container">
                                <div className="cpu-slider-labels">
                                    <span>Intel Core i5</span>
                                    <span>Intel Core i7</span>
                                    <span>AMD Ryzen 7</span>
                                    <span>AMD Ryzen 9</span>
                                </div>
                                <div className="cpu-options-list">
                                    {getDisplayedItems(processorOptions, 'processor').map(proc => (
                                        <label key={proc} className="checkbox-item">
                                            <input 
                                                type="checkbox" 
                                                checked={tempFilters.processors.includes(proc)}
                                                onChange={() => toggleArrayFilter('processors', proc)}
                                            />
                                            <span className="checkbox-label">{proc}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            {processorOptions.length > INITIAL_DISPLAY_LIMIT && (
                                <button 
                                    className="show-more-btn"
                                    onClick={() => toggleShowMore('processor')}
                                >
                                    {showMore.processor ? 'Thu gọn ↑' : `Xem thêm ${processorOptions.length - INITIAL_DISPLAY_LIMIT} mục ↓`}
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Price Range - Collapsible with Slider */}
                <div className="filter-group">
                    <div 
                        className={`filter-group-header ${!expandedSections.price ? 'collapsed' : ''}`}
                        onClick={() => toggleSection('price')}
                    >
                        <label>
                            <MdMoney /> KHOẢNG GIÁ
                            {(tempFilters.minPrice || tempFilters.maxPrice) && (
                                <span className="selected-count">✓</span>
                            )}
                        </label>
                        <FiChevronDown className={`expand-icon ${expandedSections.price ? 'expanded' : ''}`} />
                    </div>
                    {expandedSections.price && (
                        <div className="price-range-wrapper">
                            <div className="price-slider-display">
                                <div className="price-track">
                                    <div className="price-progress"></div>
                                </div>
                            </div>
                            <div className="price-inputs-row">
                                <div className="price-input-group">
                                    <label>TỪ</label>
                                    <input 
                                        type="text" 
                                        placeholder="0"
                                        value={tempFilters.minPrice ? tempFilters.minPrice.toLocaleString() : ''}
                                        onChange={(e) => handleTempFilterChange('minPrice', e.target.value.replace(/,/g, ''))}
                                        onKeyPress={handleKeyPress}
                                    />
                                </div>
                                <div className="price-input-group">
                                    <input 
                                        type="text" 
                                        placeholder="Chọn tiêu chí"
                                        value={tempFilters.maxPrice ? tempFilters.maxPrice.toLocaleString() : ''}
                                        onChange={(e) => handleTempFilterChange('maxPrice', e.target.value.replace(/,/g, ''))}
                                        onKeyPress={handleKeyPress}
                                    />
                                    <FiChevronDown className="dropdown-icon" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* In Stock Checkbox */}
                <div className="filter-group checkbox-only">
                    <label className="checkbox-label-inline">
                        <input 
                            type="checkbox" 
                            checked={tempFilters.inStock}
                            onChange={(e) => handleTempFilterChange('inStock', e.target.checked)}
                        />
                        <MdHome className="checkbox-icon" />
                        <span>Chỉ hiển thị sản phẩm còn hàng</span>
                    </label>
                </div>

                {/* Sort By - Collapsible */}
                <div className="filter-group">
                    <div 
                        className={`filter-group-header ${!expandedSections.sort ? 'collapsed' : ''}`}
                        onClick={() => toggleSection('sort')}
                    >
                        <label><MdSort /> SẮP XẾP</label>
                        <FiChevronDown className={`expand-icon ${expandedSections.sort ? 'expanded' : ''}`} />
                    </div>
                    {expandedSections.sort && (
                        <select 
                            value={tempFilters.sortBy} 
                            onChange={(e) => handleTempFilterChange('sortBy', e.target.value)}
                            className="sort-select"
                        >
                            <option value="">Mới nhất</option>
                            <option value="price_asc">Giá: Thấp đến Cao</option>
                            <option value="price_desc">Giá: Cao đến Thấp</option>
                            <option value="popularity">Phổ biến nhất</option>
                        </select>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="filter-actions">
                    <button 
                        className="apply-filters-btn"
                        onClick={handleApplyFilters}
                    >
                        <span className="btn-icon">✓</span> ÁP DỤNG
                    </button>

                    <button 
                        className="clear-filters-btn"
                        onClick={handleClearFilters}
                    >
                        <FiX /> XÓA LỌC
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default FilterSidebar;
