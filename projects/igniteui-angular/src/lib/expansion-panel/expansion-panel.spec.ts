import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, Injectable, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { async, TestBed, ComponentFixture, tick, fakeAsync, flush } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SortingDirection } from '../data-operations/sorting-expression.interface';
import { IgxToggleModule } from '../directives/toggle/toggle.directive';
import { IgxRippleModule } from '../directives/ripple/ripple.directive';
import { IgxButtonModule } from '../directives/button/button.directive';
import { IgxDropDownBase, Navigate } from '../drop-down/drop-down.component';
import { IgxExpansionPanelComponent } from './expansion-panel.component';
import { IgxExpansionPanelModule } from './expansion-panel.module';
import { UIInteractions, wait } from '../test-utils/ui-interactions.spec';
import { IgxGridComponent, IgxGridModule } from '../grid';
import { IgxListComponent, IgxListModule } from '../list';
import { IgxInputDirective } from '../directives/input/input.directive';
import { IgxGridAPIService } from '../grid/api.service';

const CSS_CLASS_EXPANSION_PANEL = 'igx-expansion-panel';
const CSS_CLASS_PANEL_HEADER = 'igx-expansion-panel__header';
const CSS_CLASS_PANEL_BODY = 'igx-expansion-panel-body';
const CSS_CLASS_PANEL_HEADER_COLLAPSED = 'igx-expansion-panel__header--collapsed';
const CSS_CLASS_LIST = 'igx-list';
const CSS_CLASS_PANEL_BUTTON = 'igx-icon';

describe('igxExpansionPanel', () => {
    beforeEach(async(() => {
        // TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            declarations: [
                IgxExpansionPanelGridComponent,
                IgxExpansionPanelListComponent
            ],
            imports: [
                IgxExpansionPanelModule,
                NoopAnimationsModule,
                IgxToggleModule,
                IgxRippleModule,
                IgxButtonModule,
                IgxListModule,
                IgxGridModule.forRoot()
            ]
        }).compileComponents();
    }));


    describe('General tests: ', () => {
        it('Should initialize the expansion panel component properly', () => {
            const fixture: ComponentFixture<IgxExpansionPanelListComponent> = TestBed.createComponent(IgxExpansionPanelListComponent);
            fixture.detectChanges();
            const panel = fixture.componentInstance.expansionPanel;
            expect(fixture.componentInstance).toBeDefined();
            expect(panel).toBeDefined();
            // expect(panel.toggleBtn).toBeDefined();
            // expect(panel.headerButtons).toBeDefined();
            expect(panel.disabled).toBeDefined();
            expect(panel.disabled).toEqual(false);
            // expect(panel.ariaLabelledBy).toBeDefined();
            // expect(panel.ariaLabelledBy).toEqual('');
            // expect(panel.headerButtons).toBeDefined();
            // expect(panel.headerButtons).toEqual(true);
            expect(panel.animationSettings).toBeDefined();
            expect(panel.collapsed).toBeDefined();
            expect(panel.collapsed).toBeTruthy();
            panel.toggle();
            fixture.detectChanges();
            expect(panel.collapsed).toEqual(false);
        });
        it('Should properly accept input properties', () => {
            const fixture = TestBed.createComponent(IgxExpansionPanelListComponent);
            fixture.detectChanges();
            const panel = fixture.componentInstance.expansionPanel;
            expect(panel.disabled).toEqual(false);
            expect(panel.collapsed).toEqual(true);
            // expect(panel.ariaLabelledBy).toEqual('');
            // expect(panel.headerButtons).toEqual(true);
            panel.disabled = true;
            expect(panel.disabled).toEqual(true);
            panel.collapsed = false;
            expect(panel.collapsed).toEqual(false);
            panel.ariaLabelledBy = 'test label area';
            expect(panel.ariaLabelledBy).toEqual('test label area');
            panel.headerButtons = false;
            expect(panel.headerButtons).toEqual(false);
        });
    });

    describe('Expansion tests: ', () => {
        function verifyPanelExpansionState(
            collapsed: boolean,
            panel: IgxExpansionPanelComponent,
            panelContainer: any,
            panelHeader: HTMLElement,
            button: HTMLElement) {
            expect(panel.collapsed).toEqual(collapsed);
            const ariaExpanded = collapsed ? 'false' : 'true';
            expect(panelContainer.getAttribute('aria-expanded')).toMatch(ariaExpanded);
            expect(panelHeader.classList.contains(CSS_CLASS_PANEL_HEADER_COLLAPSED)).toEqual(collapsed);
            const iconName = collapsed ? 'expand_more' : 'expand_less';
            expect(button.getAttribute('ng-reflect-icon-name')).toMatch(iconName);
            if (collapsed) {
                expect(panelContainer.children[1].children.length).toEqual(0);
            } else {
                const panelBody = panelContainer.getElementsByTagName(CSS_CLASS_PANEL_BODY)[0];
                expect(panelBody).toBeDefined();
                const list = panelBody.getElementsByTagName(CSS_CLASS_LIST)[0];
                expect(list).toBeDefined();
            }
        }
        it('Should change panel expansion state on header interaction', fakeAsync(() => {
            const fixture: ComponentFixture<IgxExpansionPanelListComponent> = TestBed.createComponent(IgxExpansionPanelListComponent);
            fixture.detectChanges();
            const panel = fixture.componentInstance.expansionPanel;
            const panelContainer = fixture.nativeElement.querySelector('.' + CSS_CLASS_EXPANSION_PANEL);
            const panelHeader = fixture.nativeElement.querySelector('.' + CSS_CLASS_PANEL_HEADER) as HTMLElement;
            const button =  fixture.nativeElement.querySelector('.' + CSS_CLASS_PANEL_BUTTON) as HTMLElement;
            verifyPanelExpansionState(true, panel, panelContainer, panelHeader, button);

            panelHeader.click();
            tick();
            fixture.detectChanges();
            verifyPanelExpansionState(false, panel, panelContainer, panelHeader, button);

            panelHeader.click();
            tick();
            fixture.detectChanges();
            verifyPanelExpansionState(true, panel, panelContainer, panelHeader, button);

            panelHeader.click();
            tick();
            fixture.detectChanges();
            verifyPanelExpansionState(false, panel, panelContainer, panelHeader, button);
        }));
        it('Should change panel expansion state on button clicking', fakeAsync(() => {
            const fixture: ComponentFixture<IgxExpansionPanelListComponent> = TestBed.createComponent(IgxExpansionPanelListComponent);
            fixture.detectChanges();
            const panel = fixture.componentInstance.expansionPanel;
            const panelContainer = fixture.nativeElement.querySelector('.' + CSS_CLASS_EXPANSION_PANEL);
            const panelHeader = fixture.nativeElement.querySelector('.' + CSS_CLASS_PANEL_HEADER) as HTMLElement;
            const button =  fixture.nativeElement.querySelector('.' + CSS_CLASS_PANEL_BUTTON) as HTMLElement;
            verifyPanelExpansionState(true, panel, panelContainer, panelHeader, button);

            button.click();
            tick();
            fixture.detectChanges();
            verifyPanelExpansionState(false, panel, panelContainer, panelHeader, button);

            button.click();
            tick();
            fixture.detectChanges();
            verifyPanelExpansionState(true, panel, panelContainer, panelHeader, button);

            button.click();
            tick();
            fixture.detectChanges();
            verifyPanelExpansionState(false, panel, panelContainer, panelHeader, button);
        }));
        it('Should change panel expansion state using API methods', fakeAsync(() => {
            const fixture: ComponentFixture<IgxExpansionPanelListComponent> = TestBed.createComponent(IgxExpansionPanelListComponent);
            fixture.detectChanges();
            const panel = fixture.componentInstance.expansionPanel;
            const panelContainer = fixture.nativeElement.querySelector('.' + CSS_CLASS_EXPANSION_PANEL);
            const panelHeader = fixture.nativeElement.querySelector('.' + CSS_CLASS_PANEL_HEADER) as HTMLElement;
            const button =  fixture.nativeElement.querySelector('.' + CSS_CLASS_PANEL_BUTTON) as HTMLElement;
            verifyPanelExpansionState(true, panel, panelContainer, panelHeader, button);

            panel.expand();
            tick();
            fixture.detectChanges();
            verifyPanelExpansionState(false, panel, panelContainer, panelHeader, button);

            panel.collapse();
            tick();
            fixture.detectChanges();
            verifyPanelExpansionState(true, panel, panelContainer, panelHeader, button);

            panel.expand();
            tick();
            fixture.detectChanges();
            verifyPanelExpansionState(false, panel, panelContainer, panelHeader, button);

            panel.collapse();
            tick();
            fixture.detectChanges();
            verifyPanelExpansionState(true, panel, panelContainer, panelHeader, button);

        }));
        it('Should change panel expansion state using toggle method', fakeAsync(() => {
            const fixture: ComponentFixture<IgxExpansionPanelListComponent> = TestBed.createComponent(IgxExpansionPanelListComponent);
            fixture.detectChanges();
            const panel = fixture.componentInstance.expansionPanel;
            const panelContainer = fixture.nativeElement.querySelector('.' + CSS_CLASS_EXPANSION_PANEL);
            const panelHeader = fixture.nativeElement.querySelector('.' + CSS_CLASS_PANEL_HEADER) as HTMLElement;
            const button =  fixture.nativeElement.querySelector('.' + CSS_CLASS_PANEL_BUTTON) as HTMLElement;
            verifyPanelExpansionState(true, panel, panelContainer, panelHeader, button);

            panel.toggle();
            tick();
            fixture.detectChanges();
            verifyPanelExpansionState(false, panel, panelContainer, panelHeader, button);

            panel.toggle();
            tick();
            fixture.detectChanges();
            verifyPanelExpansionState(true, panel, panelContainer, panelHeader, button);

            panel.toggle();
            tick();
            fixture.detectChanges();
            verifyPanelExpansionState(false, panel, panelContainer, panelHeader, button);

            panel.toggle();
            tick();
            fixture.detectChanges();
            verifyPanelExpansionState(true, panel, panelContainer, panelHeader, button);

        }));
        it('Should change panel expansion', fakeAsync(() => {
            const fixture: ComponentFixture<IgxExpansionPanelListComponent> = TestBed.createComponent(IgxExpansionPanelListComponent);
            fixture.detectChanges();
            const panel = fixture.componentInstance.expansionPanel;
            const panelContainer = fixture.nativeElement.querySelector('.' + CSS_CLASS_EXPANSION_PANEL);
            const panelHeader = fixture.nativeElement.querySelector('.' + CSS_CLASS_PANEL_HEADER) as HTMLElement;
            const button =  fixture.nativeElement.querySelector('.' + CSS_CLASS_PANEL_BUTTON) as HTMLElement;
            verifyPanelExpansionState(true, panel, panelContainer, panelHeader, button);

            panel.expand();
            tick();
            fixture.detectChanges();
            verifyPanelExpansionState(false, panel, panelContainer, panelHeader, button);

            panelHeader.click();
            tick();
            fixture.detectChanges();
            verifyPanelExpansionState(true, panel, panelContainer, panelHeader, button);

            button.click();
            tick();
            fixture.detectChanges();
            verifyPanelExpansionState(false, panel, panelContainer, panelHeader, button);

            panel.collapse();
            tick();
            fixture.detectChanges();
            verifyPanelExpansionState(true, panel, panelContainer, panelHeader, button);

            panelHeader.click();
            tick();
            fixture.detectChanges();
            verifyPanelExpansionState(false, panel, panelContainer, panelHeader, button);

            panel.toggle();
            tick();
            fixture.detectChanges();
            verifyPanelExpansionState(true, panel, panelContainer, panelHeader, button);
        }));
    });
});


@Component({
    template: `
    <igx-expansion-panel #expansionPanel>
<igx-expansion-panel-header headerHeight="50px">
                <igx-expansion-panel-title>Product orders</igx-expansion-panel-title>
                <igx-expansion-panel-description>Product orders details</igx-expansion-panel-description>
            </igx-expansion-panel-header>
            <igx-expansion-panel-body>
<igx-grid #grid1 [data] = "data" [autoGenerate]="true" [width]="width" [height]="height">
        </igx-grid>
       </igx-expansion-panel-body>
</igx-expansion-panel>
`
})
export class IgxExpansionPanelGridComponent {

    @ViewChild('expansionPanel', { read: IgxExpansionPanelComponent })
    public expansionPanel: IgxExpansionPanelComponent;
    @ViewChild('grid1', { read: IgxGridComponent })
    public grid1: IgxGridComponent;

    public width = '800px';
    public height = '600px';

    public data = [
        { ProductID: 1, ProductName: 'Chai', InStock: true, UnitsInStock: 2760, OrderDate: '2005-03-21' },
        { ProductID: 2, ProductName: 'Aniseed Syrup', InStock: false, UnitsInStock: 198, OrderDate: '2008-01-15' },
        { ProductID: 3, ProductName: 'Chef Antons Cajun Seasoning', InStock: true, UnitsInStock: 52, OrderDate: '2010-11-20' },
        { ProductID: 4, ProductName: 'Grandmas Boysenberry Spread', InStock: false, UnitsInStock: 0, OrderDate: '2007-10-11' },
        { ProductID: 5, ProductName: 'Uncle Bobs Dried Pears', InStock: false, UnitsInStock: 0, OrderDate: '2001-07-27' },
        { ProductID: 6, ProductName: 'Northwoods Cranberry Sauce', InStock: true, UnitsInStock: 1098, OrderDate: '1990-05-17' },
        { ProductID: 7, ProductName: 'Queso Cabrales', InStock: false, UnitsInStock: 0, OrderDate: '2005-03-03' },
        { ProductID: 8, ProductName: 'Tofu', InStock: true, UnitsInStock: 7898, OrderDate: '2017-09-09' },
        { ProductID: 9, ProductName: 'Teatime Chocolate Biscuits', InStock: true, UnitsInStock: 6998, OrderDate: '2025-12-25' },
        { ProductID: 10, ProductName: 'Chocolate', InStock: true, UnitsInStock: 20000, OrderDate: '2018-03-01' }
    ];
}

@Component({
    template: `
<div style = "width:300px">
<igx-expansion-panel #expansionPanel>
<igx-expansion-panel-header headerHeight="50px">
<igx-expansion-panel-title>Product List</igx-expansion-panel-title>
<igx-expansion-panel-button *ngIf="templatedIcon">
                        {{collapsed() ? 'Expand':'Collapse'}}
                    </igx-expansion-panel-button>
</igx-expansion-panel-header>
<igx-expansion-panel-body>
<igx-list>
<igx-list-item [isHeader]="true">Products</igx-list-item>
<igx-list-item>Product 1</igx-list-item>
<igx-list-item>Product 2</igx-list-item>
<igx-list-item>Product 3</igx-list-item>
<igx-list-item>Product 4</igx-list-item>
<igx-list-item>Product 5</igx-list-item>
</igx-list>
</igx-expansion-panel-body>
</igx-expansion-panel>
</div>
`
})
export class IgxExpansionPanelListComponent {
    @ViewChild('expansionPanel', { read: IgxExpansionPanelHeaderComponent })
    public expansionPanel: IgxExpansionPanelComponent;
}

